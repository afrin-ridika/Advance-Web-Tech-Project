import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

import { Reservation } from './entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Parking])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
