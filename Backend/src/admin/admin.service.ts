import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Payment } from '../payment/entities/payment.entity';

import { UserRole } from '../users/enums/user-role.enum';
import { ReservationStatus } from '../reservation/enums/reservation-status.enum';
import { PaymentStatus } from '../payment/enums/payment-status.enum';

interface RevenueResult {
  totalRevenue: string | null;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboard() {
    const totalUsers = await this.userRepository.count();

    const totalParkingManagers = await this.userRepository.count({
      where: {
        role: UserRole.PARKING_MANAGER,
      },
    });

    const totalParkingAttendants = await this.userRepository.count({
      where: {
        role: UserRole.PARKING_ATTENDANT,
      },
    });

    const totalCustomers = await this.userRepository.count({
      where: {
        role: UserRole.CUSTOMER,
      },
    });

    const totalParkings = await this.parkingRepository.count();

    const totalReservations = await this.reservationRepository.count();

    const activeReservations = await this.reservationRepository.count({
      where: {
        status: ReservationStatus.ACTIVE,
      },
    });

    const completedReservations = await this.reservationRepository.count({
      where: {
        status: ReservationStatus.COMPLETED,
      },
    });

    const cancelledReservations = await this.reservationRepository.count({
      where: {
        status: ReservationStatus.CANCELLED,
      },
    });

    const totalPayments = await this.paymentRepository.count();

    const paidPayments = await this.paymentRepository.count({
      where: {
        status: PaymentStatus.PAID,
      },
    });

    const pendingPayments = await this.paymentRepository.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    });

    const revenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount),0)', 'totalRevenue')
      .where('payment.status = :status', {
        status: PaymentStatus.PAID,
      })
      .getRawOne<RevenueResult>();

    return {
      totalUsers,
      totalParkingManagers,
      totalParkingAttendants,
      totalCustomers,
      totalParkings,
      totalReservations,
      activeReservations,
      completedReservations,
      cancelledReservations,
      totalPayments,
      paidPayments,
      pendingPayments,
      totalRevenue: Number(revenue?.totalRevenue ?? 0),
    };
  }
}
