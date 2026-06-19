import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
@SkipThrottle()
export class DashboardController {
  @Get('staff')
  @Roles('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStaffDashboard(@Req() req: express.Request) {
    const { iat, exp, ...user } = req.user as any;
    return { message: 'Welcome staff', user: user };
  }

  @Get('student')
  @Roles('student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStudentDashboard(@Req() req: express.Request) {
    const { iat, exp, ...user } = req.user as any;
    return { message: 'Welcome student', user: user };
  }
}
