import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class SharePostDto extends PartialType(
	PickType(CreatePostDto, ['title']),
) {}
