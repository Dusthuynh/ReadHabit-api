import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFollowDto {
	@ApiProperty({
		default: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	followerId?: number;

	@ApiProperty({
		default: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	followeeId?: number;
}
