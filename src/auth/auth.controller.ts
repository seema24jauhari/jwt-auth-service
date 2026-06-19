import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as express from 'express'; // ← namespace import
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
@SkipThrottle()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 min, THIS route only
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 min, THIS route only
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: express.Request,
  ) {
    return this.authService.login(loginDto.email, loginDto.password, res, req);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 min, THIS route only
  refresh(@Req() req: express.Request) {
    return this.authService.refresh(req);
  }

  @Post('logout')
  logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.logout(req, res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport redirects to Google's consent screen — body never runs
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.handleOAuthLogin(req.user, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.handleOAuthLogin(req.user, res);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  setup(@Req() req: any) {
    return this.authService.setupMfa(req.user.id);
  }

  @Post('mfa/login')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 min, THIS route only
  verify(@Body() body: { code: string }, @Req() req: any) {
    return this.authService.verifyMfaLogin(req.user.sub._id, body.code);
  }
}
