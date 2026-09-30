import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

import { Parking } from './entities/parking.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, User])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
