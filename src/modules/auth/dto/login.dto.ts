import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	@ApiProperty({ description: 'User email', example: 'test1@test.com' })
	email: string;

	@MinLength(6)
	@ApiProperty({ description: 'User password', example: '123123123' })
	password: string;
}
