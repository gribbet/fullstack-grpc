import { Controller, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as genericPool from "generic-pool";
import { join } from "path";
import { Client } from "pg";
import { createDb, migrate } from "postgres-migrations";
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

const [postgresHost, postgresPort] = (
  process.env.POSTGRES || "localhost:5432"
).split(":");

const pool = genericPool.createPool<Client>({
  create: async () => {
    while (true) {
      try {
        const client = new Client({
          host: postgresHost,
          port: postgresPort ? parseInt(postgresPort) : undefined,
          user: "postgres",
          password: "postgres",
          database: "postgres",
        });
        await client.connect();
        return client;
      } catch (error) {
        if (error.message.startsWith("connect ECONNREFUSED")) continue;
        console.log(error.message);
        throw error;
      }
    }
  },
  destroy: (client: Client) => client.end(),
});

async function run<T>(f: (client: Client) => T): Promise<T> {
  const client = await pool.acquire();
  try {
    return await f(client);
  } finally {
    await pool.release(client);
  }
}

@Controller("user")
@UserServiceControllerMethods()
class UserController implements UserServiceController {
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

@Module({
  controllers: [UserController],
})
class AppModule {}

async function start() {
  const client = await pool.acquire();
  await createDb("postgres", { client });
  await migrate({ client }, "./migrations");
  await pool.release(client);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: "0.0.0.0:50051",
        package: "api",
        protoPath: join(__dirname, "../../proto/api.proto"),
      },
    }
  );
  await app.listenAsync();
}

start();
