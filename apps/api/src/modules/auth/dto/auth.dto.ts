import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsMobilePhone,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'علی' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'محمدی' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '09121234567' })
  @IsOptional()
  @IsMobilePhone('fa-IR')
  mobile?: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '09121234567' })
  @IsOptional()
  @IsMobilePhone('fa-IR')
  mobile?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  password: string;
}

export class SendOtpDto {
  @ApiProperty({ example: '09121234567' })
  @IsMobilePhone('fa-IR')
  mobile: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '09121234567' })
  @IsMobilePhone('fa-IR')
  mobile: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMobilePhone('fa-IR')
  mobile?: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class Enable2faDto {
  @ApiProperty()
  @IsString()
  password: string;
}

export class Verify2faDto {
  @ApiProperty()
  @IsString()
  code: string;
}
