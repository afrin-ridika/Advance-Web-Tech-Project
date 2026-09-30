import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Parking } from '../parking/entities/parking.entity';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Payment } from '../payment/entities/payment.entity';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Parking), useValue: {} },
        { provide: getRepositoryToken(Reservation), useValue: {} },
        { provide: getRepositoryToken(Payment), useValue: {} },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
