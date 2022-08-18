import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

}
