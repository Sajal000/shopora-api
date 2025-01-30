import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hashes a password using bcrypt
   * @param data - The password to hash
   * @returns Promise<string>
   * @throws InternalServerErrorException if hashing fails
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt: string = await bcrypt.genSalt();
      const hash: string = await bcrypt.hash(data, salt);
      return hash;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Hashing failed',
        description: (error as Error).message.split(':')[0],
      });
    }
  }

  /**
   * Compares a password with a hashed password
   * @param data - The plain password
   * @param encrypted - The hashed password
   * @returns Promise<boolean>
   * @throws InternalServerErrorException if comparison fails
   */
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      const match: boolean = await bcrypt.compare(data, encrypted);
      return match;
    } catch (error) {
      const errorMessage = (error as Error).message.split(':')[0];
      throw new InternalServerErrorException({
        message: 'Password comparison failed',
        description: errorMessage,
      });
    }
  }
}
