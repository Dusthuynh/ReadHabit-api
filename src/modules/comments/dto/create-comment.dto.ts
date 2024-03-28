import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
	IsNumber,
	IsOptional,
	IsString,
	Min,
	MinLength,
} from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@MinLength(1)
	@ApiProperty()
	message: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	@Min(1)
	parentId: number;

	@ApiHideProperty()
	postId: number;

	@ApiHideProperty()
	createdById: number;

	@ApiHideProperty()
	path: string;
}
