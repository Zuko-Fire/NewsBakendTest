import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { CreateNews, INews } from './types/news.dto';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UserDto } from 'modules/user/dto/user.dto';


describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: NewsService;

  const mockUsers:UserDto [] = [{
    id: 1,
    login: 'ttt',
    email: '2t2@wegf.rt',
    avatarPath: '/212/242.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    news: []
  },
  {
    id: 2,
    login: 'frf',
    email: '2t2@d.rt',
    avatarPath: '/212/242.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    news: []
  }

  ]
  const mockNews: INews[] = [
    {
      id: 1,
      header: "Новость дня",
      userId: 1,
      imagePath: '/222/344/2.jpg',
      text: 'Bla Bla',
      createAt: new Date(),
      user: mockUsers[1],
      updateAt: new Date()
    },
    {
      id: 2,
      header: "Новость дня",
      userId: 2,
      imagePath: '/222/344/2.jpg',
      text: 'Bla Blabbb',
      createAt: new Date(),
      user: mockUsers[1],
      updateAt: new Date()
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            findAllNews: jest.fn().mockResolvedValue(mockNews),
            findNewsById: jest.fn().mockImplementation((id: number) => {
              const news = mockNews.find((item) => item.id === id);
              if (!news) {
                throw new NotFoundException(`News with ID ${id} not found`);
              }
              return Promise.resolve(news);
            }),
            addNews: jest.fn().mockImplementation((news: INews) => {
              const newNews = { id: mockNews.length + 1, ...news };
              mockNews.push(newNews);
              return Promise.resolve(newNews);
            }),
          },
        },
      ],
    }).compile();

    newsController = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(newsController).toBeDefined();
  });

  describe('findAllNews', () => {
    it('should return an array of news', async () => {
      const result = await newsController.findAllNews();
      expect(result).toEqual(mockNews);
      expect(newsService.findAllNews).toHaveBeenCalled();
    });
  });

  describe('findNewsById', () => {
    it('should return a single news item by ID', async () => {
      const id = 1;
      const result = await newsController.findNewsById(id);
      expect(result).toEqual(mockNews[0]);
      expect(newsService.findNewsById).toHaveBeenCalledWith(id);
    });

  });

  describe('addNews', () => {
    it('should add a new news item and return it', async () => {
      const file = { filename: 'new-image.jpg' };
      const newsData = {
        title: 'New Test News',
        content: 'This is a new test news',
      };

      const result = await newsController.addNews(file as any, newsData);

      expect(result).toEqual({
        id: mockNews.length,
        ...newsData,
        imagePath: file.filename,
      });
      expect(newsService.addNews).toHaveBeenCalledWith({
        ...newsData,
        imagePath: file.filename,
      });
    });
  });
});
