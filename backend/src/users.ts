/** Types generated for queries found in "./src/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'InsertUser' parameters type */
export interface IInsertUserParams {
  user: {
    name: string | null | void
  };
}

/** 'InsertUser' return type */
export interface IInsertUserResult {
  id: string;
  name: string;
}

/** 'InsertUser' query type */
export interface IInsertUserQuery {
  params: IInsertUserParams;
  result: IInsertUserResult;
}

const insertUserIR: any = {"name":"InsertUser","params":[{"name":"user","codeRefs":{"defined":{"a":31,"b":34,"line":3,"col":8},"used":[{"a":91,"b":94,"line":8,"col":5}]},"transform":{"type":"pick_tuple","keys":["name"]}}],"usedParamSet":{"user":true},"statement":{"body":"INSERT INTO\n    users (name)\nVALUES\n    :user RETURNING *","loc":{"a":50,"b":106,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *     users (name)
 * VALUES
 *     :user RETURNING *
 * ```
 */
export const insertUser = new PreparedQuery<IInsertUserParams,IInsertUserResult>(insertUserIR);


/** 'FindUserById' parameters type */
export interface IFindUserByIdParams {
  id: string | null | void;
}

/** 'FindUserById' return type */
export interface IFindUserByIdResult {
  id: string;
  name: string;
}

/** 'FindUserById' query type */
export interface IFindUserByIdQuery {
  params: IFindUserByIdParams;
  result: IFindUserByIdResult;
}

const findUserByIdIR: any = {"name":"FindUserById","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":179,"b":180,"line":16,"col":10}]}}],"usedParamSet":{"id":true},"statement":{"body":"SELECT\n    *\nFROM\n    users\nWHERE\n    id = :id","loc":{"a":135,"b":180,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     *
 * FROM
 *     users
 * WHERE
 *     id = :id
 * ```
 */
export const findUserById = new PreparedQuery<IFindUserByIdParams,IFindUserByIdResult>(findUserByIdIR);


/** 'FindUsers' parameters type */
export interface IFindUsersParams {
  name: string | null | void;
}

/** 'FindUsers' return type */
export interface IFindUsersResult {
  id: string;
  name: string;
}

/** 'FindUsers' query type */
export interface IFindUsersQuery {
  params: IFindUsersParams;
  result: IFindUsersResult;
}

const findUsersIR: any = {"name":"FindUsers","params":[{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":263,"b":266,"line":24,"col":23},{"a":283,"b":286,"line":25,"col":8}]}}],"usedParamSet":{"name":true},"statement":{"body":"SELECT\n    *\nFROM\n    users\nWHERE\n    name ILIKE '%' || :name || '%'\n    OR :name IS NULL","loc":{"a":206,"b":294,"line":19,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     *
 * FROM
 *     users
 * WHERE
 *     name ILIKE '%' || :name || '%'
 *     OR :name IS NULL
 * ```
 */
export const findUsers = new PreparedQuery<IFindUsersParams,IFindUsersResult>(findUsersIR);


/** 'DeleteUser' parameters type */
export interface IDeleteUserParams {
  id: string | null | void;
}

/** 'DeleteUser' return type */
export type IDeleteUserResult = void;

/** 'DeleteUser' query type */
export interface IDeleteUserQuery {
  params: IDeleteUserParams;
  result: IDeleteUserResult;
}

const deleteUserIR: any = {"name":"DeleteUser","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":359,"b":360,"line":31,"col":10}]}}],"usedParamSet":{"id":true},"statement":{"body":"DELETE FROM\n    users\nWHERE\n    id = :id","loc":{"a":321,"b":360,"line":28,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM
 *     users
 * WHERE
 *     id = :id
 * ```
 */
export const deleteUser = new PreparedQuery<IDeleteUserParams,IDeleteUserResult>(deleteUserIR);


