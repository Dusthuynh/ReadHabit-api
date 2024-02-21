import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetFeedbackDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsString()
	//TODO: hanlde boolean type in service
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
