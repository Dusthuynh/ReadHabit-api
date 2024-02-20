import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Reaction extends BaseObject {
	@Column()
	type: REACT_TYPE;

	@Column()
	postId: number;

	@Column()
	userId: number;

	//RELATION
	@ManyToOne(() => Post)
	post: Post;

	@ManyToOne(() => User)
	user: User;
}
