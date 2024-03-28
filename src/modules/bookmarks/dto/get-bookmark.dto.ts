import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetBookmarkDto {
	@ApiProperty({
		required: false,
		description: 'Number of items limited',
		default: 10,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	limit?: number;

	@ApiProperty({
		required: false,
		description: 'Number of items skipped',
		default: 0,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	offset?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	ownerId?: number;
}
