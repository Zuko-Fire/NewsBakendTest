import { Test, TestingModule } from "@nestjs/testing";

import { UserDto } from "../user/dto/user.dto";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { RequestUser } from "./types/requestUser";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser: UserDto = {
    id: 1,
    login: "Polzac",
    email: "polzac@bff.com",
    avatarPath: "/uploads/afff.jgp",
    createdAt: new Date(),
    updatedAt: new Date(),
    news: [],
  };

  const mockAuthUser: RequestUser = {
    user: mockUser,
  } as RequestUser;

  const mockCreateUserDto: CreateUserDto = {
    login: "Polzac",
    email: "polzac@bff.com",
    password: "324232",
  };

  const mockLoginUserDto: LoginUserDto = {
    email: "polzac@bff.com",
    password: "324232",
  };

  const mockAuthResponse = {
    token: "regfegl'fdskgl",
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResponse),
            login: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("register", () => {
    it("Проверка регистрации register", async () => {
      const result = await authController.register(mockCreateUserDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe("login", () => {
    it("проверка авторизации login", async () => {
      const result = await authController.login(mockLoginUserDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginUserDto);
    });
  });

  describe("whoami ", () => {
    it("Проверка токена авторизации", () => {
      const result = authController.getUserByToken(mockAuthUser);

      expect(result).toEqual(mockUser);
    });
  });
});
