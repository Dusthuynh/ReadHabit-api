import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { REACT_TYPE } from 'src/shared/enum/react.enum';

export class CreateReaction {
	@ApiProperty({
		enum: REACT_TYPE,
	})
	@IsEnum(REACT_TYPE)
	type: REACT_TYPE;

	@ApiHideProperty()
	userId: number;

	@ApiHideProperty()
	postId: number;
}
