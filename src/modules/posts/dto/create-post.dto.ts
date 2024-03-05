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

	@ApiProperty({
		required: false,
		type: String,
		description: 'Array of Tags. Format: ( Tags: string1,string2 )',
		default: 'Backend,Nestjs,Kiến thức nền tảng',
	})
	@IsOptional()
	@IsString()
	tags: string;

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
		enum: [POST_STATUS.CREATED, POST_STATUS.PUBLISHED],
	})
	@IsOptional()
	@IsEnum(POST_STATUS)
	status?: POST_STATUS;

	@ApiProperty({
		enum: [
			POST_TYPE.EXTERNAL_PERSONAL_BLOG,
			POST_TYPE.EXTERNAL_POST,
			POST_TYPE.INTERNAL_POST,
		],
		default: POST_TYPE.EXTERNAL_PERSONAL_BLOG,
	})
	@IsEnum([
		POST_TYPE.EXTERNAL_PERSONAL_BLOG,
		POST_TYPE.EXTERNAL_POST,
		POST_TYPE.INTERNAL_POST,
	])
	type: POST_TYPE;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	postImage?: string;
}
