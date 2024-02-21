import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { STATUS_USER_REVIEW } from 'src/shared/enum/review.enum';

export class ReviewPostDto {
	@ApiProperty({
		enum: STATUS_USER_REVIEW,
		default: STATUS_USER_REVIEW.CONFIRM,
	})
	@IsEnum(STATUS_USER_REVIEW)
	status: STATUS_USER_REVIEW;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	message: string;
}
