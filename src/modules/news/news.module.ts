import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { News } from '../../db/models/news.model';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [SequelizeModule.forFeature([News])],
})
class NewsModule {}
export { NewsModule };
