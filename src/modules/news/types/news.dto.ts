import { StreamableFile } from '@nestjs/common';

import { User } from '../../user/user.model';
import { UserDto } from 'modules/user/dto/user.dto';

export interface INews {
  id: number;
  header: string;
  userId: number;
  imagePath?: string;
  text: string;
  createAt: Date;
  user: UserDto;
  updateAt: Date;
}

export interface CreateNews {
  header: string;
  userId: number;
  image?: Blob;
  text: string;
}
