// jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message || 'Invalid or missing token',
      );
    }
    return user;
  }
}
