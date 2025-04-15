import { HttpException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import {
  FAILED_TO_CHANGE_DATA,
  INVALID_PASSWORD,
} from "../../constants/errorMessage";
import { News } from "../news/news.model";
import { Tag } from "../tag/tag.model";

import { UpdateUserDto } from "./dto/updateUser.dto";
import { User } from "./user.model";
import { UserService } from "./user.service";

const mockUpdateUser: UpdateUserDto = {
  login: "login",
  newPassword: "newPassword",
  currentPassword: "password",
  avatarPath: "avatarPath",
};

const userId = 1;

const mockUser: User = {
  id: userId,
  login: "login",
  email: "email",
  password: "password",
  avatarPath: "avatarPath",
  createdAt: new Date(),
  updatedAt: new Date(),
  news: [],
  validatePassword(password) {
    return new Promise((resolve) => resolve(this.password === password));
  },
  toJSON() {
    return {
      id: this.id,
      login: this.login,
      email: this.email,
      avatarPath: this.avatarPath,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      news: this.news,
    };
  },
} as User;

describe("UserService", () => {
  let userService: UserService;
  let userRepo: jest.Mocked<typeof User>;
  let newsModel: jest.Mocked<typeof News>;
  let tagModel: jest.Mocked<typeof Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: News,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: Tag,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepo = module.get(getModelToken(User));
    newsModel = module.get(News);
    tagModel = module.get(Tag);
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  it("FAILED_TO_CHANGE_DATA", async () => {
    await expect(userService.editUser(userId, mockUser)).rejects.toThrow(
      FAILED_TO_CHANGE_DATA
    );
  });

  it("INVALID_PASSWORD", async () => {
    (userRepo.findOne as jest.Mock).mockImplementationOnce(() => {
      return mockUser;
    });
    const updateUser = { ...mockUpdateUser, currentPassword: "wrongPassword" };
    await expect(userService.editUser(userId, updateUser)).rejects.toThrow(
      INVALID_PASSWORD
    );
    await expect(
      userService.editUser(userId, { currentPassword: null, newPassword: null })
    ).rejects.toThrow();
    await expect(
      userService.editUser(userId, {
        currentPassword: "pass",
        newPassword: "pass",
      })
    ).rejects.toThrow();
  });
  it("HttpException", async () => {
    const id = 1;
    (userRepo.findOne as jest.Mock).mockImplementationOnce(() => {
      throw new HttpException("SEVER ERROR", 500);
    });
    await expect(userService.editUser(id, mockUser)).rejects.toThrow(
      new HttpException("SEVER ERROR", 500)
    );
  });
  it("should update user", async () => {
    (userRepo.findOne as jest.Mock).mockImplementationOnce(() => {
      return mockUser;
    });
    (userRepo.update as jest.Mock).mockImplementationOnce((args) => {
      return { mockUser, ...args };
    });
    const result = await userService.editUser(userId, mockUpdateUser);
    expect(result).toEqual(mockUser.toJSON());
  });
});
