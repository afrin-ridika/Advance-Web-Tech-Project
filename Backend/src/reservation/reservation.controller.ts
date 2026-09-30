import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { UserRole } from '../users/enums/user-role.enum';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.reservationService.createReservation(
      createReservationDto,
      req.user.sub,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PARKING_MANAGER)
  async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.reservationService.cancelReservation(id, req.user.sub);
  }

  @Post('check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARKING_ATTENDANT)
  checkIn(@Body() checkInDto: CheckInDto) {
    return this.reservationService.checkIn(checkInDto);
  }

  @Post('check-out')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARKING_ATTENDANT)
  checkOut(@Body() checkInDto: CheckInDto) {
    return this.reservationService.checkOut(checkInDto);
  }
}
