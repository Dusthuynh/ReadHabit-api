import { Category } from 'src/modules/categories/entities/category.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity()
export class Tag extends BaseObject {
	@Column()
	name: string;

	@Column()
	categoryId: number;

	@ManyToMany(() => Post, (post: Post) => post.tags)
	@JoinTable({ name: 'post_tag' })
	posts: Post[];

	@ManyToOne(() => Category)
	category: Category;
}
