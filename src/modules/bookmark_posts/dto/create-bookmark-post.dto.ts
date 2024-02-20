import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBookmarkPostDto {
	@ApiProperty()
	@IsNumber()
	bookmarkId: number;

	@ApiHideProperty()
	postId: number;

	@ApiHideProperty()
	position: number;
}
