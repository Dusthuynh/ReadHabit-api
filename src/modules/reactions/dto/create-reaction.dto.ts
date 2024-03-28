import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { REACT_TYPE } from 'src/shared/enum/react.enum';

export class CreateReactionDto {
	@ApiProperty({
		enum: REACT_TYPE,
		required: false,
	})
	@IsOptional()
	@IsEnum(REACT_TYPE)
	type?: REACT_TYPE;

	@ApiHideProperty()
	userId: number;

	@ApiHideProperty()
	postId: number;
}
