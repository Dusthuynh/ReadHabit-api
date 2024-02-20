import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateContentSourceDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(3)
	name?: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	contentSourceImage?: string;
}
