import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateParkingDto {
  @IsString()
  @IsNotEmpty()
  parkingName: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @Min(1)
  totalSlots: number;

  @IsNumber()
  @Min(0)
  pricePerHour: number;
}
