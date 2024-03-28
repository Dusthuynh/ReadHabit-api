import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateBookmarkPostPositionDto {
	@ApiProperty({ default: 1 })
	@IsNumber()
	@Min(0)
	position1: number;

	@ApiProperty({ default: 3 })
	@IsNumber()
	@Min(0)
	position2: number;
}
