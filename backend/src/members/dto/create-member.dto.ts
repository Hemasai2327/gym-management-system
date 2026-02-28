import { IsEmail, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  monthlyFee: number;

  /** ISO string from frontend */
  @IsDateString()
  startDate: string;

  @IsNumber()
  duration: number;

  /** Calculated on backend */
  membershipEndDate?: Date;
}
