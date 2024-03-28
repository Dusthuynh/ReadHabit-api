import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class QuickGeneratePostDto {
	@ApiProperty({ default: 1 })
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	contentSourceId: number;

	@ApiProperty({ default: 'string' })
	@IsString()
	url: string;
}
