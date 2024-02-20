import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray } from 'class-validator';

export class SeenNotiDto {
	@ApiProperty({
		type: [Number],
		description: 'Array of notificationRecipient Id',
	})
	@IsArray()
	@ArrayMinSize(1)
	notificationRecipients: number[];
}
