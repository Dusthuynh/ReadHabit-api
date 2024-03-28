import { POST_TYPE } from 'src/shared/enum/post.enum';

export interface PostContent {
	type: POST_TYPE;
	URL: string;
	data: string;
	contentSourceId: number;
	categoryId: number;
}
