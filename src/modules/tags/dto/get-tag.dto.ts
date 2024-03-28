import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetTagDto extends DefaultListDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	categoryId?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@Transform((val) => parseInt(val.value))
	@IsNumber()
	createdById?: number;
}
