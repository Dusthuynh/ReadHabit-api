import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/bases/service.base';
import { Tag } from './entities/tag.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService extends BaseService<Tag> {
	constructor(
		@InjectRepository(Tag)
		private userRepository: Repository<Tag>,
	) {
		super(userRepository);
	}
}
