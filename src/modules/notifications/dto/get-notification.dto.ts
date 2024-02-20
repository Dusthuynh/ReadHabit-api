import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetNotificationDto extends DefaultListDto {
	@ApiProperty({
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsString()
	//TODO: hanlde boolean type in service
	seen?: string;
}
