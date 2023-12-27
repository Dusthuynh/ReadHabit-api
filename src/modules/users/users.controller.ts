import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';

@Controller('users')
@ApiTags('users')
export class UsersController {
	@Public()
	@Get('')
	getListUsers() {
		return 'get list user';
	}

	@Public()
	@Get(':id')
	getUser() {
		return 'get user by id';
	}
}
