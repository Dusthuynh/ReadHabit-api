import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	name?: string;

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	categoryId?: number;
}
