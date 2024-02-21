import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetNotificationDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsString()
	@Matches(/^(true|false)$/i, {
		message: 'The isLock value must be either true or false',
	})
	seen?: string;
}
