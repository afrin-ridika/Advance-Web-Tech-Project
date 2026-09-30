import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARKING_MANAGER)
  async createParking(
    @Body() createParkingDto: CreateParkingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.parkingService.createParking(createParkingDto, req.user.sub);
  }

  @Get()
  async getAllParking(@Query('search') search?: string) {
    return this.parkingService.getAllParking(search);
  }
  @Get(':id')
  async getParkingById(@Param('id', ParseIntPipe) id: number) {
    return this.parkingService.getParkingById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARKING_MANAGER)
  async updateParking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkingDto: UpdateParkingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.parkingService.updateParking(
      id,
      updateParkingDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARKING_MANAGER)
  async deleteParking(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.parkingService.deleteParking(id, req.user.sub);
  }
}
