import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
  FAILED_TO_CHANGE_DATA,
  INVALID_PASSWORD,
} from '../../constants/errorMessage';
import { CreateUserDto } from '../auth/dto/createUser.dto';
import { News } from '../news/news.model';
import { Tag } from '../tag/tag.model';

import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepo: typeof User,
  ) {}

  checkUser(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  getUserById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
    });
  }
  getUserAndNewsById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      attributes: [
        'id',
        'login',
        'email',
        'avatarPath',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: News,
          attributes: [
            'header',
            'imagePath',
            'text',
            'createdAt',
            'updatedAt',
            'createdAt',
            'id',
          ],
          include: [
            {
              model: Tag,
              attributes: ['id', 'value'],
            },
          ],
        },
      ],
    });
  }
  createUser(request: CreateUserDto): Promise<User> {
    return this.userRepo.create({ ...request });
  }

  async editUser(
    id: number,
    { login, newPassword, currentPassword, avatarPath }: UpdateUserDto,
  ): Promise<User> {
    try {
      const user: User = await this.getUserById(id);

      if (
        currentPassword != null &&
        newPassword != null &&
        currentPassword !== newPassword
      ) {
        const isValid = await user.validatePassword(currentPassword);

        if (!isValid) throw new BadRequestException(INVALID_PASSWORD);
        this.userRepo.update(
          { password: newPassword },
          { where: { id: user.id }, individualHooks: true },
        );
      }

      if (login != null) {
        this.userRepo.update({ login }, { where: { id: user.id } });
      }
      if (avatarPath != null) {
        this.userRepo.update({ avatarPath }, { where: { id: user.id } });
      }
      const userJson = user.toJSON();
      userJson.login = login;
      delete userJson.password;
      return userJson;
    } catch (exception) {
      console.error(exception);
      if (exception instanceof HttpException) {
        throw new BadRequestException(exception.message);
      }
      throw new BadRequestException(FAILED_TO_CHANGE_DATA);
    }
  }
}
