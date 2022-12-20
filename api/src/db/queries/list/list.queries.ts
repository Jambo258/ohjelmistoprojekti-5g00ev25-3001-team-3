/** Types generated for queries found in "src/db/queries/list/list.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetList' parameters type */
export interface IGetListParams {
  user_id: number | null | void;
}

/** 'GetList' return type */
export interface IGetListResult {
  product_id: string;
}

/** 'GetList' query type */
export interface IGetListQuery {
  params: IGetListParams;
  result: IGetListResult;
}

const getListIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":53,"b":60}]}],"statement":"SELECT product_id FROM user_products WHERE user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT product_id FROM user_products WHERE user_id = :user_id
 * ```
 */
export const getList = new PreparedQuery<IGetListParams,IGetListResult>(getListIR);


/** 'AddListItem' parameters type */
export interface IAddListItemParams {
  product_id: string;
  user_id: number;
}

/** 'AddListItem' return type */
export interface IAddListItemResult {
  product_id: string;
}

/** 'AddListItem' query type */
export interface IAddListItemQuery {
  params: IAddListItemParams;
  result: IAddListItemResult;
}

const addListItemIR: any = {"usedParamSet":{"product_id":true,"user_id":true},"params":[{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":66}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":77}]}],"statement":"INSERT INTO user_products(product_id, user_id) VALUES (:product_id!, :user_id!) RETURNING product_id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_products(product_id, user_id) VALUES (:product_id!, :user_id!) RETURNING product_id
 * ```
 */
export const addListItem = new PreparedQuery<IAddListItemParams,IAddListItemResult>(addListItemIR);


/** 'DeleteListItem' parameters type */
export interface IDeleteListItemParams {
  product_id: string;
  user_id: number;
}

/** 'DeleteListItem' return type */
export interface IDeleteListItemResult {
  product_id: string;
}

/** 'DeleteListItem' query type */
export interface IDeleteListItemQuery {
  params: IDeleteListItemParams;
  result: IDeleteListItemResult;
}

const deleteListItemIR: any = {"usedParamSet":{"user_id":true,"product_id":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":42,"b":50}]},{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":80}]}],"statement":"DELETE FROM user_products\nWHERE user_id = :user_id! AND product_id = :product_id!\nRETURNING product_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM user_products
 * WHERE user_id = :user_id! AND product_id = :product_id!
 * RETURNING product_id
 * ```
 */
export const deleteListItem = new PreparedQuery<IDeleteListItemParams,IDeleteListItemResult>(deleteListItemIR);


