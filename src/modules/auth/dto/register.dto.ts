import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
	@IsString()
	@ApiProperty()
	username: string;

	@IsEmail()
	@IsString()
	@ApiProperty()
	email: string;

	@IsString()
	@ApiProperty()
	password: string;
}
