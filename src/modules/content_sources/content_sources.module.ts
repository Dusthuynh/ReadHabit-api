import { Module } from '@nestjs/common';
import { ContentSourcesController } from './content_sources.controller';
import { ContentSourcesService } from './content_sources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentSource } from './entities/content_source.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ContentSource])],
	controllers: [ContentSourcesController],
	providers: [ContentSourcesService],
	exports: [ContentSourcesService],
})
export class ContentSourcesModule {}
