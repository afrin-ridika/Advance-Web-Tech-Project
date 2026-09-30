import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { User } from '../users/entities/user.entity';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        { provide: getRepositoryToken(Parking), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
