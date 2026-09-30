import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { UsersModule } from '../users/users.module';

import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Parking, Reservation, Payment]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
