import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { POST_STATUS, POST_TYPE } from 'src/shared/enum/post.enum';

export class GetPostDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	sharePostId?: number;

	@ApiProperty({
		isArray: true,
		required: false,
		enum: POST_STATUS,
	})
	@IsOptional()
	@Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
	@IsArray()
	@IsEnum(POST_STATUS, { each: true })
	status?: POST_STATUS[];

	@ApiProperty({
		isArray: true,
		required: false,
		enum: POST_TYPE,
	})
	@IsOptional()
	@Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
	@IsArray()
	@IsEnum(POST_TYPE, { each: true })
	type?: POST_TYPE[];

	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	categoryId?: number;

	@ApiProperty({
		required: false,
		type: String,
	})
	@IsOptional()
	tagId?: string;

	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	createdById?: number;

	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	contentSourceId?: number;
}
