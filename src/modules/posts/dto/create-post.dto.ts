import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';

export class CreatePostDto {
	@ApiHideProperty()
	createdById?: number;

	@ApiHideProperty()
	imageURL: string;

	@ApiProperty({ default: 1 })
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	categoryId: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	sharePostId?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	contentSourceId?: number;

	@ApiProperty({ default: 'string' })
	@IsString()
	title: string;

	@ApiProperty({ default: 'string' })
	@IsString()
	content: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	originalPostURL?: string;

	@ApiProperty({
		required: false,
		enum: POST_STATUS,
		default: POST_STATUS.CREATED,
	})
	@IsOptional()
	@IsEnum(POST_STATUS)
	status?: POST_STATUS;

	@ApiProperty({ enum: POST_TYPE, default: POST_TYPE.EXTERNAL_PERSONAL_BLOG })
	@IsEnum(POST_TYPE)
	type: POST_TYPE;

	@ApiProperty({
		type: 'string',
		format: 'binary',
	})
	@IsOptional()
	postImage?: string;
}
