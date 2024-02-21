import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetFeedbackDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsString()
	@Matches(/^(true|false)$/i, {
		message: 'The isLock value must be either true or false',
	})
	isCheck?: string;

	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	createById?: number;
}
