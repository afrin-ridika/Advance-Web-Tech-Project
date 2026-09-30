import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ParkingModule } from './parking/parking.module';
import { UsersModule } from './users/users.module';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AdminModule,
    AuthModule,
    DatabaseModule,
    ParkingModule,
    UsersModule,
    ReservationModule,
    PaymentModule,
  ],
})
export class AppModule {}
