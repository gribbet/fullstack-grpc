import { GrpcWebImpl, UserServiceClientImpl } from "./api";

const endpoint = process.env.ENDPOINT || "http://localhost:8080";
const rpc = new GrpcWebImpl(endpoint, {});
const userService = new UserServiceClientImpl(rpc);

async function main() {
  const user = await userService.Create({ name: "Test user 1" });
  console.log(user);
}

main();
