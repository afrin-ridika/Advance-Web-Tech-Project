import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';

import { User } from '../users/entities/user.entity';
import { Reservation } from '../reservation/entities/reservation.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, userId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: createPaymentDto.reservationId,
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
      throw new ForbiddenException('You can only pay for your own reservation');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: {
        reservation: {
          id: reservation.id,
        },
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already completed');
    }

    const payment = this.paymentRepository.create({
      amount: Number(reservation.parking.pricePerHour),
      status: PaymentStatus.PAID,
      reservation,
      user: reservation.user,
    });

    await this.paymentRepository.save(payment);

    return payment;
  }

  async getMyPayments(userId: number) {
    return await this.paymentRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        reservation: true,
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getAllPayments() {
    return await this.paymentRepository.find({
      relations: {
        user: true,
        reservation: {
          parking: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
