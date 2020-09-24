import { Controller, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import {
  CreateUser,
  User,
  UserServiceController,
  UserServiceControllerMethods,
} from "./api";

@Controller("user")
@UserServiceControllerMethods()
class UserController implements UserServiceController {
  private users: User[] = [];

  create(user: CreateUser): User | Promise<User> | Observable<User> {
    console.log("Creating user", user);
    const id =
      this.users.map((_) => _.id).reduce((a, b) => Math.max(a, b), 0) + 1;
    const created: User = {
      id,
      ...user,
    };
    this.users.push(created);
    return created;
  }
}

@Module({
  controllers: [UserController],
})
class AppModule {}

async function start() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: "0.0.0.0:50051",
        package: "api",
        protoPath: join(__dirname, "../proto/api.proto"),
      },
    }
  );
  await app.listenAsync();
}

start();
