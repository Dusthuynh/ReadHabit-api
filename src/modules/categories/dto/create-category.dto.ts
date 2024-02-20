import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@MinLength(3)
	@MaxLength(12)
	@ApiProperty({ default: 'Technical' })
	name: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	categoryImage?: string;
}
