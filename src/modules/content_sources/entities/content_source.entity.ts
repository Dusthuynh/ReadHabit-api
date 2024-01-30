import { Post } from 'src/modules/posts/entities/post.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class ContentSource extends BaseObject {
	@Column()
	name: string;

	@Column()
	avatar: string;

	@OneToMany(() => Post, (post: Post) => post.contentSource)
	posts: Post[];
}
