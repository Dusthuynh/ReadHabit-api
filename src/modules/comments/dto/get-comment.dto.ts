import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsOptional,
	IsNumber,
	IsString,
	IsBooleanString,
	Matches,
	IsBoolean,
	IsNotEmpty,
} from 'class-validator';

export class GetCommentDto {
	@ApiProperty({
		required: false,
		description: 'Number of items limited',
		default: 10,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	limit?: number;

	@ApiProperty({
		required: false,
		description: 'Number of items skipped',
		default: 0,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	offset?: number;

	@ApiProperty()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	postId?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	@Matches(/^(\d+,)+$/, {
		message: 'Invalid path format.',
	})
	path?: string;

	@ApiProperty()
	@IsBooleanString()
	@Matches(/^(true|false)$/i, {
		message: 'The includingChildren value must be either true or false',
	})
	includingChildren: string;
}
