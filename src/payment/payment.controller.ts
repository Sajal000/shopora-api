import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './providers/payment.service';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(
    /**
     * Inject stripeService
     */
    private readonly stripeService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create checkout session
   * @param body
   * @returns
   */
  @ApiOperation({ summary: 'Create checkout session' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a checkout session',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post('checkout/:productId')
  async createCheckoutSession(
    @Param('productId') productId: string,
    @Body() body: { amount: number; currency: string },
  ) {
    return this.stripeService.createCheckoutSession(
      productId,
      body.amount,
      body.currency as 'usd',
    );
  }

  /**
   * Stripe Webhook to handle payment events
   * @param request
   * @param body
   * @param signature
   * @returns
   */
  @ApiOperation({ summary: 'Stripe Webhook to handle payment events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully handled payment',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post('webhook')
  async handleWebhook(
    @Req() request: Request,
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const stripe = new Stripe(
        this.configService.get<string>('STRIPE_SECRET_KEY') || '',
        {
          apiVersion: '2025-02-24.acacia',
        },
      );

      const endpointSecret = this.configService.get<string>(
        'STRIPE_WEBHOOK_SECRET',
      );

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          JSON.stringify(body),
          signature,
          endpointSecret!,
        );
      } catch (error) {
        return {
          status: 400,
          message: (error as Error).message.split(':')[0],
          description: 'Webhook signature verification failed',
        };
      }

      await this.stripeService.handleWebHookEvent(event);
      return { received: true };
    } catch (error) {
      return {
        status: 500,
        message: (error as Error).message.split(':')[0],
        description: 'Webhook processing failed',
      };
    }
  }

  /**
   * Fetch payment session
   * @param sessionId
   * @returns
   */
  @ApiOperation({ summary: 'Fetch payment session' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched payment session',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get('session/:sessionId')
  async getSessionStatus(@Param('sessionId') sessionId: string) {
    return this.stripeService.getSessionStatus(sessionId);
  }
}
