import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@MinLength(3)
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
