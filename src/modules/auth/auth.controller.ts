import { Controller, Post } from '@nestjs/common';
import { Public } from './utils';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	@Public()
	@Post('login')
	login() {
		return 'login here';
	}

	@Public()
	@Post('signup')
	signup() {
		return 'signup here';
	}
}
