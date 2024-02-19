import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@MinLength(3)
	@MaxLength(12)
	@ApiProperty()
	name: string;
}
