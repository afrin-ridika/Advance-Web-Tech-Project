import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Index } from 'typeorm';

@Entity('parking')
export class Parking {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  parkingName: string;

  @Index()
  @Column()
  location: string;

  @Column()
  totalSlots: number;

  @Column()
  availableSlots: number;

  @Column('decimal')
  pricePerHour: number;

  @ManyToOne(() => User, (user) => user.parkings, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Reservation, (reservation) => reservation.parking)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
