/* eslint-disable */
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


export interface User {
  id: number;
  name: string;
}

export interface CreateUser {
  name: string;
}

export interface UserServiceClient {

  create(request: CreateUser): Observable<User>;

}

export interface UserServiceController {

  create(request: CreateUser): Promise<User> | Observable<User> | User;

}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['create'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('UserService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('UserService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const API_PACKAGE_NAME = 'api'
export const USER_SERVICE_NAME = 'UserService';