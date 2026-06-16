import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as express from 'express'; // ← make sure this is at the top


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,  
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const password_hash = await argon2.hash(registerDto.password, { type: argon2.argon2id });
    const user = await this.userModel.create({ email: registerDto.email, password_hash:password_hash });

    return { id: user._id, email: user.email };
  }

  async login(email: string, password: string, res: express.Response) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const access_token = this.jwtService.sign({ sub: user._id, email: user.email });
    
    let payload = {email: email, password: password}
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get<string>('REFRESH_SECRET'),
      expiresIn: '7d',
    });
    
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,   // JavaScript on the page CANNOT read this cookie
      secure: this.config.get<string>('NODE_ENV') === 'production', // ← false in dev, true in prod
      sameSite: 'strict',// not sent on cross-site requests (CSRF protection)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await this.userModel.findByIdAndUpdate(user._id, { refresh_token });
    return { access_token };
  }

  // auth.service.ts
  async refresh(req: express.Request) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException('No refresh token');

    // check if token is blacklisted/deleted
    const user = await this.userModel.findOne({ refresh_token: token });
    if (!user) throw new UnauthorizedException('Invalid refresh token');
  

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('REFRESH_SECRET'),
      });

      // Issue a new access token
      const access_token = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
      });

      return { access_token };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(req: express.Request, res: express.Response) {
    const token = req.cookies?.refresh_token;
    
    // blacklist it — even if attacker has this token, it won't work
    await this.userModel.findOneAndUpdate(
      { refresh_token: token },
      { refresh_token: null }
    );

    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }
}