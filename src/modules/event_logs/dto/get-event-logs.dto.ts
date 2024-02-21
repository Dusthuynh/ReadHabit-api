import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { EVENT_ACTION } from 'src/shared/enum/event.enum';

export class GetEventLogDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	actorId?: number;

	@ApiProperty({
		isArray: true,
		required: false,
		enum: EVENT_ACTION,
	})
	@IsOptional()
	@Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
	@IsArray()
	@IsEnum(EVENT_ACTION, { each: true })
	action?: EVENT_ACTION[];

	@ApiProperty({
		required: false,
		type: Date,
		example: new Date().toISOString(),
	})
	@IsOptional()
	@IsDateString()
	startDate: Date;

	@ApiProperty({
		required: false,
		type: Date,
		example: new Date().toISOString(),
	})
	@IsOptional()
	@IsDateString()
	endDate: Date;
}
