import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';

export class UpdatePostDto {
	@ApiHideProperty()
	imageURL: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	categoryId?: number;

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
	sharePostId?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	contentSourceId?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	title: string;

	@ApiProperty({ required: false })
	@IsOptional()
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

	@ApiProperty({
		required: false,
		enum: POST_TYPE,
		default: POST_TYPE.EXTERNAL_PERSONAL_BLOG,
	})
	@IsOptional()
	@IsEnum(POST_TYPE)
	type: POST_TYPE;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	postImage?: string;
}
