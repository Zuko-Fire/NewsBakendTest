import { Test, TestingModule } from "@nestjs/testing";
import { UserDto } from "./dto/user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { INews } from "modules/news/types/news.dto";
import { CreateUserDto } from "modules/auth/dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { AuthGuard } from "../auth/auth.guard";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const mockUsers: User[] = [
    {
      id: 1,
      login: "ttt",
      email: "2t2@wegf.rt",
      avatarPath: "/212/242.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
      news: [],
    } as User,
    {
      id: 2,
      login: "frf",
      email: "2t2@d.rt",
      avatarPath: "/212/242.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
      news: [],
    } as User,
  ];
  const mockNews: INews[] = [
    {
      id: 1,
      header: "Новость дня",
      userId: 1,
      imagePath: '/222/344/2.jpg',
      text: 'Bla Bla',
      createAt: new Date(),
      user: mockUsers[1] as UserDto,
      updateAt: new Date()
    },
    {
      id: 2,
      header: "Новость дня",
      userId: 2,
      imagePath: '/222/344/2.jpg',
      text: 'Bla Blabbb',
      createAt: new Date(),
      user: mockUsers[1] as UserDto,
      updateAt: new Date()
    },
  ]

  beforeEach(async()=> {
    const module:TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          checkUser: jest.fn().mockImplementation((email: string) => {
            const user = mockUsers.find((val) => val.email === email);
            return Promise.resolve(user);
          }),
          getUserById: jest.fn().mockImplementation((id: number) => {
            const user = mockUsers.find((val) => val.id === id);
            return Promise.resolve(user);
          }),
          createUser: jest.fn().mockImplementation((user: CreateUserDto) => {
            const newUser = {...user, id: mockUsers.length + 1}
            mockUsers.push(newUser as User)
            return Promise.resolve(newUser)
          }),
          editUser: jest.fn().mockImplementation((id: number,data: UpdateUserDto
          )=> {
            const userIndex = mockUsers.findIndex((u) => u.id === id);
            if (userIndex === -1) throw new Error('User not found');
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...data } as User;
            return mockUsers[userIndex];
          }),
          getUserAndNewsById: jest.fn().mockImplementation((id: number) => {
            const user = mockUsers.find((val) => val.id === id);
            return Promise.resolve(user);
          }),

        },
      }],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile()
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  })

  it('User controller по умолчанию', async ()=> {
    expect(userController).toBeDefined()
  })
  describe('getUserById', ()=> {
    it('Получение существующего пользователя', async ()=> {
      const userId = 1
      const result = await userController.getUserById(userId)
      
      expect(result).toEqual(mockUsers[0])
      expect(userService.getUserAndNewsById).toHaveBeenCalledWith(userId);
      
    })

    it('Получение не существуюшего пользователя', async () => {
      const userId = 999;
      const user = await userController.getUserById(userId)
      expect(user).toBe(undefined)
    });
  })
});
