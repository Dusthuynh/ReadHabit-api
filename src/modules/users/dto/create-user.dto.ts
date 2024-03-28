import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@MinLength(3)
	@MaxLength(12)
	@ApiProperty()
	username: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@MinLength(6)
	@IsString()
	@ApiProperty()
	password: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	avatar?: string;

	@IsOptional()
	@IsDateString()
	@ApiProperty()
	birthday?: Date;

	@IsOptional()
	@IsString()
	@ApiProperty()
	phoneNumber?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	lastName?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	firstName?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	about?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	youtubeLink?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	facebookLink?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	linkedinLink?: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	twitterLink?: string;
}
