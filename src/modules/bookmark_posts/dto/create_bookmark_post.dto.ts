import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkPostDto {
	@ApiProperty()
	bookmarkId: number;

	@ApiHideProperty()
	postId: number;

	@ApiHideProperty()
	position: number;
}
