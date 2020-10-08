import { Controller } from "@nestjs/common";
import { run } from "./database";
import {
  CreateUser,
  Empty,
  Id,
  Query,
  User,
  Users,
  UserServiceController,
  UserServiceControllerMethods,
} from "./generated/api";
import { deleteUser, findUsers, insertUser } from "./generated/users";

@Controller("user")
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  async create(user: CreateUser): Promise<User> {
    return run(async (client) => {
      const [created] = await insertUser.run({ user }, client);
      console.log("Created", created);
      return created;
    });
  }

  async list(query: Query): Promise<Users> {
    return await run(async (client) => {
      const users = await findUsers.run(query, client);
      return { users };
    });
  }

  async delete({ id }: Id): Promise<Empty> {
    return await run(async (client) => {
      if (id) {
        await deleteUser.run({ id }, client);
      }
      return {};
    });
  }
}
