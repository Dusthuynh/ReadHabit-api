import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE } from 'src/shared/enum/user.enum';

export class TokenPayloadDto {
	sub: number;
	iss: string;
	role: USER_ROLE;
}

export class TokenResponse {
	@ApiProperty({ type: String })
	access_token: string;

	@ApiProperty({ type: String })
	refresh_token: string;
}
