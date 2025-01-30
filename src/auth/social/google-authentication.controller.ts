import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dto/google-token.dto';
import { AuthType } from '../enum/auth-type.enum';
import { Auth } from '../decorator/auth.decorator';

@ApiTags('Auth')
@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    /**
     * Inject Google auth service
     */
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}
  @ApiOperation({
    summary: 'Authenticates google users',
  })
  @Post()
  public async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(googleTokenDto);
  }
}
