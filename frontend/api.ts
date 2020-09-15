/* eslint-disable */
import { BrowserHeaders } from 'browser-headers';
import { grpc } from '@improbable-eng/grpc-web';
import { Writer, Reader } from 'protobufjs/minimal';


export interface User {
  id: number;
  name: string;
}

export interface CreateUser {
  name: string;
}

const baseUser: object = {
  id: 0,
  name: "",
};

const baseCreateUser: object = {
  name: "",
};

export interface UserService {

  Create(request: DeepPartial<CreateUser>, metadata?: grpc.Metadata): Promise<User>;

}

export class UserServiceClientImpl implements UserService {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  Create(request: DeepPartial<CreateUser>, metadata?: grpc.Metadata): Promise<User> {
    return this.rpc.unary(UserServiceCreateDesc, CreateUser.fromPartial(request), metadata);
  }

}

interface Rpc {

  unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;

}

export class GrpcWebImpl implements Rpc {

  private host: string;

  private options: { transport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined };

  constructor(host: string, options: { transport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined }) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    return new Promise((resolve, reject) => {
      const maybeCombinedMetadata =
        metadata && this.options.metadata
          ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
          : metadata || this.options.metadata;
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }

}

export const User = {
  encode(message: User, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).uint32(message.id);
    writer.uint32(18).string(message.name);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): User {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUser } as User;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): User {
    const message = { ...baseUser } as User;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<User>): User {
    const message = { ...baseUser } as User;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    return message;
  },
  toJSON(message: User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

export const CreateUser = {
  encode(message: CreateUser, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CreateUser {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateUser } as CreateUser;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateUser {
    const message = { ...baseCreateUser } as CreateUser;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateUser>): CreateUser {
    const message = { ...baseCreateUser } as CreateUser;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    return message;
  },
  toJSON(message: CreateUser): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

const UserServiceDesc = {
  serviceName: "api.UserService",
}
const UserServiceCreateDesc: UnaryMethodDefinitionish = {
  methodName: "Create",
  service: UserServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary: function serializeBinary() {
      return CreateUser.encode(this).finish();
    }
    ,
  } as any,
  responseType: {
    deserializeBinary: function deserializeBinary(data: Uint8Array) {
      return { ...User.decode(data), toObject() { return this; } };
    }
    ,
  } as any,
}
import UnaryMethodDefinition = grpc.UnaryMethodDefinition;
type UnaryMethodDefinitionish = UnaryMethodDefinition<any, any>;

type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;