import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/utils';

@Controller('posts')
export class PostsController {
	@Public()
	@Get('')
	getManyPosts() {
		return 'get list post';
	}
}
