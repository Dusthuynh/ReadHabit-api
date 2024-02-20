import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateNotificationDto {
	@ApiProperty()
	@IsString()
	message: string;

	@ApiProperty({
		type: [Number],
		description: 'Array of userId',
	})
	@IsArray()
	@ArrayMinSize(1)
	recipients: number[];
}
