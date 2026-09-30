import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { Reservation } from '../reservation/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Reservation])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
