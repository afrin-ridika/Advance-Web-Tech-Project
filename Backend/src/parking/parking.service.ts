import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Parking } from './entities/parking.entity';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createParking(createParkingDto: CreateParkingDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const parking = this.parkingRepository.create({
      ...createParkingDto,
      availableSlots: createParkingDto.totalSlots,
      owner: user,
    });

    return await this.parkingRepository.save(parking);
  }

  async getAllParking(search?: string) {
    if (search) {
      return await this.parkingRepository.find({
        where: [
          {
            parkingName: ILike(`%${search}%`),
          },
          {
            location: ILike(`%${search}%`),
          },
        ],
        relations: {
          owner: true,
        },
      });
    }

    return await this.parkingRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  async getParkingById(id: number) {
    const parking = await this.parkingRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    if (!parking) {
      throw new NotFoundException('Parking not found');
    }

    return parking;
  }

  async updateParking(
    id: number,
    updateParkingDto: UpdateParkingDto,
    userId: number,
  ) {
    const parking = await this.parkingRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    if (!parking) {
      throw new NotFoundException('Parking not found');
    }

    if (parking.owner.id !== userId) {
      throw new ForbiddenException('You can only update your own parking');
    }

    Object.assign(parking, updateParkingDto);

    return await this.parkingRepository.save(parking);
  }

  async deleteParking(id: number, userId: number) {
    const parking = await this.parkingRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    if (!parking) {
      throw new NotFoundException('Parking not found');
    }

    if (parking.owner.id !== userId) {
      throw new ForbiddenException('You can only delete your own parking');
    }

    await this.parkingRepository.remove(parking);

    return {
      message: 'Parking deleted successfully',
    };
  }

  async updateAvailableSlots(parkingId: number, availableSlots: number) {
    const parking = await this.parkingRepository.findOne({
      where: {
        id: parkingId,
      },
    });

    if (!parking) {
      throw new NotFoundException('Parking not found');
    }

    if (availableSlots < 0 || availableSlots > parking.totalSlots) {
      throw new BadRequestException('Invalid available slots');
    }

    parking.availableSlots = availableSlots;

    return await this.parkingRepository.save(parking);
  }
}
