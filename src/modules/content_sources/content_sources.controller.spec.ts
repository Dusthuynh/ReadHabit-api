import { Test, TestingModule } from '@nestjs/testing';
import { ContentSourcesController } from './content_sources.controller';

describe('ContentSourcesController', () => {
  let controller: ContentSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentSourcesController],
    }).compile();

    controller = module.get<ContentSourcesController>(ContentSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
