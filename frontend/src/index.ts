import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { GrpcWebImpl, UserServiceClientImpl } from "./generated/api";

const endpoint = process.env.ENDPOINT || "http://localhost:8080";
const rpc = new GrpcWebImpl(endpoint, {});
export const userService = new UserServiceClientImpl(rpc);

async function main() {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
}

main();
