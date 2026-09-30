import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/user-role.enum';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return await this.userRepository.find({
        where: [
          {
            fullName: ILike(`%${search}%`),
          },
          {
            email: ILike(`%${search}%`),
          },
          {
            phone: ILike(`%${search}%`),
          },
        ],
      });
    }

    return await this.userRepository.find();
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUser(id: number) {
    await this.findById(id);

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  async updateUserRole(id: number, role: UserRole) {
    const user = await this.findById(id);

    user.role = role;

    await this.userRepository.save(user);

    return {
      message: 'User role updated successfully',
      user,
    };
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);

    return {
      message: 'Profile updated successfully',
      user,
    };
  }
}
