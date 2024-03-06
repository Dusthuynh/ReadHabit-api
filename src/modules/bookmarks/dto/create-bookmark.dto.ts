import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBookmarkDto {
	@IsString()
	@MinLength(3)
	@ApiProperty({ default: 'Technical' })
	name: string;

	@ApiHideProperty()
	ownerId: number;
}
