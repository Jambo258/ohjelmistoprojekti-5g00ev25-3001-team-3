/** Types generated for queries found in "src/db/queries/users/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type user_roles = 'admin' | 'normal';

/** 'GetAllUsers' parameters type */
export type IGetAllUsersParams = void;

/** 'GetAllUsers' return type */
export interface IGetAllUsersResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  role: user_roles;
  username: string;
}

/** 'GetAllUsers' query type */
export interface IGetAllUsersQuery {
  params: IGetAllUsersParams;
  result: IGetAllUsersResult;
}

const getAllUsersIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id, username, created_at, last_login, role FROM users"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, created_at, last_login, role FROM users
 * ```
 */
export const getAllUsers = new PreparedQuery<IGetAllUsersParams,IGetAllUsersResult>(getAllUsersIR);


/** 'GetUser' parameters type */
export interface IGetUserParams {
  id: number;
}

/** 'GetUser' return type */
export interface IGetUserResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  role: user_roles;
  username: string;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

const getUserIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":76}]}],"statement":"SELECT id, username, created_at, last_login, role \nFROM users\nWHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, created_at, last_login, role 
 * FROM users
 * WHERE id = :id!
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams,IGetUserResult>(getUserIR);


/** 'AddUser' parameters type */
export interface IAddUserParams {
  user: {
    username: string | null | void,
    password: string | null | void
  };
}

/** 'AddUser' return type */
export interface IAddUserResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  role: user_roles;
  username: string;
}

/** 'AddUser' query type */
export interface IAddUserQuery {
  params: IAddUserParams;
  result: IAddUserResult;
}

const addUserIR: any = {"usedParamSet":{"user":true},"params":[{"name":"user","required":true,"transform":{"type":"pick_tuple","keys":[{"name":"username","required":false},{"name":"password","required":false}]},"locs":[{"a":46,"b":51}]}],"statement":"INSERT INTO users (username, password)\nVALUES :user!\nRETURNING id, username, created_at, last_login, role"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, password)
 * VALUES :user!
 * RETURNING id, username, created_at, last_login, role
 * ```
 */
export const addUser = new PreparedQuery<IAddUserParams,IAddUserResult>(addUserIR);


/** 'UpdateUser' parameters type */
export interface IUpdateUserParams {
  id: number;
  password: string | null | void;
  role: user_roles | null | void;
  username: string | null | void;
}

/** 'UpdateUser' return type */
export interface IUpdateUserResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  role: user_roles;
  username: string;
}

/** 'UpdateUser' query type */
export interface IUpdateUserQuery {
  params: IUpdateUserParams;
  result: IUpdateUserResult;
}

const updateUserIR: any = {"usedParamSet":{"username":true,"password":true,"role":true,"id":true},"params":[{"name":"username","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":49},{"a":163,"b":171},{"a":205,"b":213}]},{"name":"password","required":false,"transform":{"type":"scalar"},"locs":[{"a":87,"b":95},{"a":249,"b":257},{"a":290,"b":298}]},{"name":"role","required":false,"transform":{"type":"scalar"},"locs":[{"a":129,"b":133},{"a":334,"b":338},{"a":370,"b":374}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":153,"b":156}]}],"statement":"UPDATE users SET\n    username = COALESCE(:username, username),\n    password = COALESCE(:password, password),\n    role = COALESCE(:role, role)\nWHERE id = :id!\nAND (:username :: VARCHAR(255) IS NOT NULL AND :username IS DISTINCT FROM username OR\n     :password :: VARCHAR(60) IS NOT NULL AND :password IS DISTINCT FROM password OR\n     :role :: user_roles IS NOT NULL AND :role IS DISTINCT FROM role)\nRETURNING id, username, created_at, last_login, role"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET
 *     username = COALESCE(:username, username),
 *     password = COALESCE(:password, password),
 *     role = COALESCE(:role, role)
 * WHERE id = :id!
 * AND (:username :: VARCHAR(255) IS NOT NULL AND :username IS DISTINCT FROM username OR
 *      :password :: VARCHAR(60) IS NOT NULL AND :password IS DISTINCT FROM password OR
 *      :role :: user_roles IS NOT NULL AND :role IS DISTINCT FROM role)
 * RETURNING id, username, created_at, last_login, role
 * ```
 */
export const updateUser = new PreparedQuery<IUpdateUserParams,IUpdateUserResult>(updateUserIR);


/** 'GetUserAuthInfo' parameters type */
export interface IGetUserAuthInfoParams {
  username: string;
}

/** 'GetUserAuthInfo' return type */
export interface IGetUserAuthInfoResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  password: string;
  role: user_roles;
  username: string;
}

/** 'GetUserAuthInfo' query type */
export interface IGetUserAuthInfoQuery {
  params: IGetUserAuthInfoParams;
  result: IGetUserAuthInfoResult;
}

const getUserAuthInfoIR: any = {"usedParamSet":{"username":true},"params":[{"name":"username","required":true,"transform":{"type":"scalar"},"locs":[{"a":37,"b":46}]}],"statement":"SELECT * FROM users WHERE username = :username!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM users WHERE username = :username!
 * ```
 */
export const getUserAuthInfo = new PreparedQuery<IGetUserAuthInfoParams,IGetUserAuthInfoResult>(getUserAuthInfoIR);


/** 'DeleteUser' parameters type */
export interface IDeleteUserParams {
  id: number;
}

/** 'DeleteUser' return type */
export interface IDeleteUserResult {
  created_at: Date;
  id: number;
  last_login: Date | null;
  role: user_roles;
  username: string;
}

/** 'DeleteUser' query type */
export interface IDeleteUserQuery {
  params: IDeleteUserParams;
  result: IDeleteUserResult;
}

const deleteUserIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":32}]}],"statement":"DELETE FROM users\nWHERE id = :id!\nRETURNING id, username, created_at, last_login, role"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM users
 * WHERE id = :id!
 * RETURNING id, username, created_at, last_login, role
 * ```
 */
export const deleteUser = new PreparedQuery<IDeleteUserParams,IDeleteUserResult>(deleteUserIR);


