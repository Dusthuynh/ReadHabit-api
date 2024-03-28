import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateTagDto {
	@IsArray()
	@ApiProperty()
	tags: string[];

	@IsNumber()
	@ApiProperty()
	categoryId: number;
}
