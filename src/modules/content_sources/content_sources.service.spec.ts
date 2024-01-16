import { Test, TestingModule } from '@nestjs/testing';
import { ContentSourcesService } from './content_sources.service';

describe('ContentSourcesService', () => {
  let service: ContentSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentSourcesService],
    }).compile();

    service = module.get<ContentSourcesService>(ContentSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
