import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetBookmarkDto extends DefaultListDto {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	ownerId?: number;
}
