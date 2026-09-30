import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Parking } from '../../parking/entities/parking.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { Payment } from '../../payment/entities/payment.entity';
import { OneToMany } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @Column({
    unique: true,
  })
  reservationCode: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Parking, (parking) => parking.reservations)
  @JoinColumn()
  parking: Parking;

  @OneToMany(() => Payment, (payment) => payment.reservation)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;
}
