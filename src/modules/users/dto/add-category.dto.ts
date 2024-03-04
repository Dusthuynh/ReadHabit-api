import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray } from 'class-validator';

export class AddCategoryDto {
	@ApiProperty({
		type: [Number],
		description: 'Array of categoryIds',
	})
	@IsArray()
	@ArrayMinSize(1)
	categoryIds: number[];
}
