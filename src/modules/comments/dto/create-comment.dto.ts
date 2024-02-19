import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@ApiProperty()
	message: string;

	@ApiHideProperty()
	postId: number;

	@ApiHideProperty()
	createdById: number;
}
