import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetRankDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	ownerId?: number;

	@ApiProperty({
		required: false,
		type: Number,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	rankLevelId?: number;

	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsString()
	@Matches(/^(true|false)$/i, {
		message: 'The isLock value must be either true or false',
	})
	isLock?: string;

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
