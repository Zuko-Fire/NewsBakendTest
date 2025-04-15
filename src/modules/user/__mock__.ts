import { User } from "./user.model";

export const USERS_MOCK: User[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    login: "login2",
    email: "email2",
    password: "password2",
    avatarPath: "avatarPath2",
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
    }
  },
] as User[];
