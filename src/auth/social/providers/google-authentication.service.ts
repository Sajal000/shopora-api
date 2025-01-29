import { forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/users/provider/user.service';

export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
}
