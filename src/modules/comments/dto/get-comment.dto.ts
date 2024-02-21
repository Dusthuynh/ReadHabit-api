import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetCommentDto extends DefaultListDto {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	postId?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	userId?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	//TODO: valid path for format: 1,3,4
	path?: string;
}
