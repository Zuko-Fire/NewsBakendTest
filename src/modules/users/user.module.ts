import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../../db/models/user.model';

@Module({
  controllers: [],
  providers: [],
  imports: [SequelizeModule.forFeature([User])],
  exports: [],
})
export class UserModule {}
