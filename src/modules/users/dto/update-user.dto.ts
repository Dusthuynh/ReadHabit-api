import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { USER_ROLE } from 'src/shared/enum/user.enum';

export class UpdateUserDto extends PartialType(
	PickType(CreateUserDto, [
		'birthday',
		'firstName',
		'lastName',
		'phoneNumber',
		'about',
		'facebookLink',
		'linkedinLink',
		'twitterLink',
		'youtubeLink',
		'password',
	]),
) {
	@ApiProperty({
		required: false,
		enum: USER_ROLE,
	})
	@IsOptional()
	@IsEnum(USER_ROLE)
	role?: USER_ROLE;
}
