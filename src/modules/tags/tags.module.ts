import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entities';

@Module({
	imports: [TypeOrmModule.forFeature([Tag])],
	controllers: [TagsController],
	providers: [TagsService],
	exports: [TagsService],
})
export class TagsModule {}
