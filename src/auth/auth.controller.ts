import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as express from 'express'; // ← namespace import
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,     
) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 min, THIS route only
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response, @Req() req: express.Request) {
    return this.authService.login(loginDto.email, loginDto.password, res, req);
  }
  
  @Post('refresh')
  refresh(@Req() req: express.Request) {
    return this.authService.refresh(req);
  }

  @Post('logout')
  logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    return this.authService.logout(req, res);
  }
}