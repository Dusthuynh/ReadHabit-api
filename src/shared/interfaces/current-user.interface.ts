import { USER_ROLE } from '../enum/user.enum';

export interface CurrentUserPayload {
	uid: number;
	role: USER_ROLE;
}
