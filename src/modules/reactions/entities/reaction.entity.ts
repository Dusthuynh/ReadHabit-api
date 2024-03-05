import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { REACT_TYPE } from 'src/shared/enum/react.enum';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Reaction {
	@Column()
	type: REACT_TYPE;

	@Column({ primary: true })
	postId: number;

	@Column({ primary: true })
	userId: number;

	//RELATION
	@ManyToOne(() => Post)
	post: Post;

	@ManyToOne(() => User)
	user: User;

	@CreateDateColumn()
	createdAt: Date;
}
