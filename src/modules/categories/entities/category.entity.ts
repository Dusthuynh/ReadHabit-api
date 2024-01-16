import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';

@Entity()
export class Category extends BaseObject {
	@Column()
	name: string;

	@ManyToMany(() => User, (user: User) => user.categories)
	@JoinTable({ name: 'user_category' })
	users: User[];

	@OneToMany(() => Post, (post: Post) => post.category)
	posts: Post[];

	@OneToMany(() => Tag, (tag: Tag) => tag.category)
	tags: Tag[];
}
