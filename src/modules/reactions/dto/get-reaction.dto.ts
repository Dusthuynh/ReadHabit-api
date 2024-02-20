import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { REACT_TYPE } from 'src/shared/enum/react.enum';

export class GetReactionDto extends DefaultListDto {
	@ApiProperty({
		enum: REACT_TYPE,
		required: false,
	})
	@IsOptional()
	@IsEnum(REACT_TYPE)
	type?: REACT_TYPE;

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
}
