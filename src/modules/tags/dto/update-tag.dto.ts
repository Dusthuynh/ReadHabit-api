import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	name?: string;

	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsBoolean()
	isLock?: boolean;
}
