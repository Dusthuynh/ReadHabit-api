import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateNotificationDto {
	@ApiProperty()
	@IsString()
	message: string;

	@ApiProperty({
		type: [Number],
		description: 'Array of recipientIds',
	})
	@IsArray()
	@ArrayMinSize(1)
	recipientIds: number[];
}
