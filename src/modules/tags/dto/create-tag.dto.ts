import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateTagDto {
	@IsArray()
	@ApiProperty()
	name: string[];

	@IsNumber()
	@ApiProperty()
	categoryId: number;
}
