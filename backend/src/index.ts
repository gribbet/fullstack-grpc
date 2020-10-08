import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { initialize } from "./database";
import { UserController } from "./UserController";

@Module({
  controllers: [UserController],
})
class AppModule {}

async function start() {
  await initialize();

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
