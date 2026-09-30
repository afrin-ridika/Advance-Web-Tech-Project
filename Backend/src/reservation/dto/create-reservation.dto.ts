import { IsDateString, IsInt } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  parkingId: number;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}
