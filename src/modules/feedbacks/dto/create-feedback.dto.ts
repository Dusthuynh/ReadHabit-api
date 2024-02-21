import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
	@ApiProperty({
		type: String,
		default: 'string',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	title: string;

	@ApiProperty({
		type: String,
		default: 'string',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	description: string;

	@ApiHideProperty()
	createById: number;
}
