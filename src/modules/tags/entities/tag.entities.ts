import { Category } from 'src/modules/categories/entities/category.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToOne, ManyToMany, Unique } from 'typeorm';

@Entity()
@Unique(['name', 'categoryId'])
export class Tag extends BaseObject {
	@Column()
	name: string;

	@Column()
	categoryId: number;

	@Column()
	createdById: number;

	@Column({ default: false })
	isLock: boolean;

	@ManyToOne(() => Category)
	category: Category;

	@ManyToMany(() => Post, (post: Post) => post.tags)
	posts: Post[];

	@ManyToOne(() => User, (user: User) => user.comments)
	createdBy: User;
}
