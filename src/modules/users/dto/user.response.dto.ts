import { ApiProperty } from '@nestjs/swagger';
import { BaseObject } from '../../../shared/entities/base-object.entity';

export class UserResponseDto extends BaseObject {
	@ApiProperty()
	displayName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	avatar?: string;
}
