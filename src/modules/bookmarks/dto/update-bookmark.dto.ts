import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookmarkDto } from './create-bookmark.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
	@IsOptional()
	@IsNumber()
	@ApiProperty({ required: false })
	position: number;
}
