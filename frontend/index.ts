import { GrpcWebImpl, UserServiceClientImpl } from "./api";

const rpc = new GrpcWebImpl("http://localhost:8080", {});
const userService = new UserServiceClientImpl(rpc);

async function main() {
  const user = await userService.Create({ name: "Test user 1" });
  console.log(user);
}

main();
