import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	name?: string;
}
