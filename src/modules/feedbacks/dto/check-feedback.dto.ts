import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray } from 'class-validator';

export class CheckFeedbackDto {
	@ApiProperty({
		type: [Number],
		description: 'Array of feedbackId',
	})
	@IsArray()
	@ArrayMinSize(1)
	feedbackIds: number[];
}
