import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CheckInDto } from './dto/check-in.dto';
import { ReservationStatus } from './enums/reservation-status.enum';

import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
  ) {}

  // Generate Unique Reservation Code
  private generateReservationCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `RSV-${random}`;
  }

  // Create Reservation
  async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const parking = await this.parkingRepository.findOne({
      where: {
        id: createReservationDto.parkingId,
      },
    });

    if (!parking) {
      throw new NotFoundException('Parking not found');
    }

    if (parking.availableSlots <= 0) {
      throw new BadRequestException('Parking is full');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reservation = this.reservationRepository.create({
      startTime: createReservationDto.startTime,
      endTime: createReservationDto.endTime,
      reservationCode: this.generateReservationCode(),
      user,
      parking,
    });

    parking.availableSlots--;

    await this.reservationRepository.save(reservation);
    await this.parkingRepository.save(parking);

    return await this.reservationRepository.findOne({
      where: {
        id: reservation.id,
      },
      relations: {
        user: true,
        parking: true,
      },
    });
  }

  // Customer Reservation History
  async getMyReservations(userId: number) {
    return await this.reservationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        parking: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Cancel Reservation
  async cancelReservation(reservationId: number, userId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: reservationId,
      },
      relations: {
        user: true,
        parking: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.user.id !== userId) {
      throw new ForbiddenException('You can only cancel your own reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation already cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;

    reservation.parking.availableSlots++;

    await this.reservationRepository.save(reservation);

    await this.parkingRepository.save(reservation.parking);

    return {
      message: 'Reservation cancelled successfully',
    };
  }

  async checkIn(checkInDto: CheckInDto) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        reservationCode: checkInDto.reservationCode,
      },
      relations: {
        parking: true,
        user: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException('Reservation is not active');
    }

    reservation.status = ReservationStatus.CHECKED_IN;

    await this.reservationRepository.save(reservation);

    return {
      message: 'Vehicle checked in successfully',
      reservation,
    };
  }

  async checkOut(checkInDto: CheckInDto) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        reservationCode: checkInDto.reservationCode,
      },
      relations: {
        parking: true,
        user: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.CHECKED_IN) {
      throw new BadRequestException('Vehicle has not checked in yet');
    }

    reservation.status = ReservationStatus.COMPLETED;

    reservation.parking.availableSlots++;

    await this.reservationRepository.save(reservation);
    await this.parkingRepository.save(reservation.parking);

    return {
      message: 'Vehicle checked out successfully',
      reservation,
    };
  }
}
