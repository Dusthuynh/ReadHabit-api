import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkPostsController } from './bookmark_posts.controller';

describe('BookmarkPostsController', () => {
  let controller: BookmarkPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkPostsController],
    }).compile();

    controller = module.get<BookmarkPostsController>(BookmarkPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
