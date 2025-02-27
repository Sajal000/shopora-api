import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/posts/schemas/posts.schemas';
import mongoose, { Model } from 'mongoose';
import { ProductStatus } from 'src/posts/enums/product-status.enum';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    /**
     * Inject configService
     */
    private configService: ConfigService,
    /**
     * Inject product mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      { apiVersion: '2025-02-24.acacia' },
    );
  }

  /**
   *
   * @param productId
   * @param amount
   * @param currency
   * @returns
   */
  async createCheckoutSession(
    productId: string,
    amount: number,
    currency: 'usd',
  ) {
    try {
      const mongoProductId = new mongoose.Types.ObjectId(productId);

      const product = await this.productModel.findById(mongoProductId);
      if (!product) {
        throw new BadRequestException('Product does not exist');
      }

      product.productStatus = ProductStatus.PENDING;
      await product.save();

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal', 'us_bank_account'],
        mode: 'payment',
        success_url: `${this.configService.get<string>('FRONTEND_URL')}/success`,
        cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/cancel`,
        metadata: {
          productId: productId,
        },
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Product ${productId}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
      });
      return { sessionId: session.id, url: session.url };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to create checkout session`,
      });
    }
  }

  async handleWebhook(req: Request, sig: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new InternalServerErrorException('Webhook secret is not defined');
    }
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        Buffer.from(JSON.stringify(req.body)),
        sig,
        webhookSecret,
      );
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Webhook signature verification failed!`,
      });
    }
    return this.handleWebHookEvent(event);
  }

  /**
   * Handle Stripe Webhook Events
   * @param sessionId
   * @returns
   */

  async handleWebHookEvent(event: Stripe.Event) {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const productId = session.metadata?.productId;

      if (!productId) {
        throw new BadRequestException(
          'Product Id is missing from session metadata',
        );
      }

      const mongoProductId = new mongoose.Types.ObjectId(productId);
      const product = await this.productModel.findById(mongoProductId);
      if (!product) {
        throw new BadRequestException('Product not found!');
      }

      if (
        event.type === 'checkout.session.completed' &&
        session.payment_status === 'paid'
      ) {
        product.productStatus = ProductStatus.SOLD;
      }
      if (
        event.type === 'checkout.session.async_payment_failed' ||
        event.type === 'checkout.session.expired'
      ) {
        product.productStatus = ProductStatus.AVAILABLE;
      }

      await product.save();

      return {
        productId: productId,
        status: product.productStatus,
        message: `Product status updated to ${product.productStatus}`,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to handle webhook event`,
      });
    }
  }

  /**
   *
   * @param sessionId
   * @returns
   */
  async getSessionStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session.payment_status;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to retrieve session status`,
      });
    }
  }
}
