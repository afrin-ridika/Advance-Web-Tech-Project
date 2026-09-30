import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { UserRole } from '../users/enums/user-role.enum';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentService.createPayment(createPaymentDto, req.user.sub);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getMyPayments(@Req() req: RequestWithUser) {
    return this.paymentService.getMyPayments(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }
}
