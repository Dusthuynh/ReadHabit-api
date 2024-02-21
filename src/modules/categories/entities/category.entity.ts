import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entities';
import { BaseObject } from 'src/shared/entities/base-object.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseObject {
	@Column()
	name: string;

	@Column({ nullable: true })
	imageURL: string;

	//RELATION
	@OneToMany(() => Post, (post: Post) => post.category)
	posts: Post[];

	@OneToMany(() => Tag, (tag: Tag) => tag.category)
	tags: Tag[];
}
