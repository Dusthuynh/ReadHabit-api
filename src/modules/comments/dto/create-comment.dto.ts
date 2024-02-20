import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@MinLength(10)
	@ApiProperty()
	message: string;

	@ApiProperty({ required: false })
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
