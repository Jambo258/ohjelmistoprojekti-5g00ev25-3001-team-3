/** Types generated for queries found in "src/db/queries/reviews/reviews.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type rating_enum = '0' | '1' | '2' | '3' | '4' | '5';

/** 'AddProduct' parameters type */
export interface IAddProductParams {
  ean: string;
}

/** 'AddProduct' return type */
export type IAddProductResult = void;

/** 'AddProduct' query type */
export interface IAddProductQuery {
  params: IAddProductParams;
  result: IAddProductResult;
}

const addProductIR: any = {"usedParamSet":{"ean":true},"params":[{"name":"ean","required":true,"transform":{"type":"scalar"},"locs":[{"a":34,"b":38}]}],"statement":"INSERT INTO products(ean) VALUES (:ean!) ON CONFLICT (ean) DO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO products(ean) VALUES (:ean!) ON CONFLICT (ean) DO NOTHING
 * ```
 */
export const addProduct = new PreparedQuery<IAddProductParams,IAddProductResult>(addProductIR);


/** 'AddReview' parameters type */
export interface IAddReviewParams {
  body: string;
  product_id: string;
  rating: rating_enum;
  user_id: number;
}

/** 'AddReview' return type */
export interface IAddReviewResult {
  body: string;
  product_id: string;
  rating: rating_enum;
  user_id: number;
  username: string | null;
}

/** 'AddReview' query type */
export interface IAddReviewQuery {
  params: IAddReviewParams;
  result: IAddReviewResult;
}

const addReviewIR: any = {"usedParamSet":{"user_id":true,"product_id":true,"body":true,"rating":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":79}]},{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":93}]},{"name":"body","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":101}]},{"name":"rating","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":111}]}],"statement":"INSERT INTO products_review(user_id, product_id, body, rating)\nVALUES (:user_id!, :product_id!, :body!, :rating!)\nRETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO products_review(user_id, product_id, body, rating)
 * VALUES (:user_id!, :product_id!, :body!, :rating!)
 * RETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id
 * ```
 */
export const addReview = new PreparedQuery<IAddReviewParams,IAddReviewResult>(addReviewIR);


/** 'DeleteReview' parameters type */
export interface IDeleteReviewParams {
  product_id: string;
  user_id: number;
}

/** 'DeleteReview' return type */
export interface IDeleteReviewResult {
  body: string;
  product_id: string;
  rating: rating_enum;
  user_id: number;
  username: string | null;
}

/** 'DeleteReview' query type */
export interface IDeleteReviewQuery {
  params: IDeleteReviewParams;
  result: IDeleteReviewResult;
}

const deleteReviewIR: any = {"usedParamSet":{"user_id":true,"product_id":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":44,"b":52}]},{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":82}]}],"statement":"DELETE FROM products_review\nWHERE user_id = :user_id! AND product_id = :product_id!\nRETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM products_review
 * WHERE user_id = :user_id! AND product_id = :product_id!
 * RETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id
 * ```
 */
export const deleteReview = new PreparedQuery<IDeleteReviewParams,IDeleteReviewResult>(deleteReviewIR);


/** 'GetReviews' parameters type */
export interface IGetReviewsParams {
  product_id: string;
}

/** 'GetReviews' return type */
export interface IGetReviewsResult {
  body: string;
  product_id: string;
  rating: rating_enum;
  user_id: number;
  username: string;
}

/** 'GetReviews' query type */
export interface IGetReviewsQuery {
  params: IGetReviewsParams;
  result: IGetReviewsResult;
}

const getReviewsIR: any = {"usedParamSet":{"product_id":true},"params":[{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":232,"b":243}]}],"statement":"SELECT users.username, products_review.product_id, products_review.body, products_review.rating, products_review.user_id FROM products_review\nINNER JOIN users ON products_review.user_id = users.id\nWHERE products_review.product_id = :product_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT users.username, products_review.product_id, products_review.body, products_review.rating, products_review.user_id FROM products_review
 * INNER JOIN users ON products_review.user_id = users.id
 * WHERE products_review.product_id = :product_id!
 * ```
 */
export const getReviews = new PreparedQuery<IGetReviewsParams,IGetReviewsResult>(getReviewsIR);


