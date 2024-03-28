import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateContentSourceDto {
	@IsString()
	@MinLength(3)
	@ApiProperty({ default: 'Spiderum' })
	name: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	contentSourceImage?: string;

	@ApiHideProperty()
	avatar?: string;
}
