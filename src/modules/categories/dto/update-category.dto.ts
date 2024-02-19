import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	name?: string;
}
