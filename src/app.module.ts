import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Dialect } from "sequelize/types/sequelize";

import { AuthModule } from "./modules/auth/auth.module";
import { FileModule } from "./modules/files/files.module";
import { News } from "./modules/news/news.model";
import { NewsModule } from "./modules/news/news.module";
import { OpenaiModule } from "./modules/openai/openai.module";
import { Tag } from "./modules/tag/tag.model";
import { TagNews } from "./modules/tag/tagnews.model";
import { User } from "./modules/user/user.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, News, Tag, TagNews],
    }),
    NewsModule,
    AuthModule,
    FileModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
