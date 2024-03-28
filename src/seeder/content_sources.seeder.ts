import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { ContentSource } from 'src/modules/content_sources/entities/content_source.entity';

type IContentSource = Partial<ContentSource>;
@Injectable()
export class ContentSourceSeeder implements Seeder {
	constructor(
		@InjectRepository(ContentSource)
		private contentSouceRepository: Repository<ContentSource>,
	) {}

	async seed(): Promise<any> {
		let items: IContentSource[] = [];

		for (let i = 0; i < 10; i++) {
			const data = {
				name: faker.internet.domainName(),
				avatar: faker.image.avatarGitHub(),
			};
			items.push(data);
		}
		await this.contentSouceRepository.save(items);
	}
	async drop(): Promise<any> {
		await this.contentSouceRepository.delete({});
	}
}
