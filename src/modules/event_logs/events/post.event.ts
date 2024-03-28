import { EVENT_ACTION } from 'src/shared/enum/event.enum';

export class PostEvent {
	postId: number;
	actorId: number;
	action: EVENT_ACTION;
}
