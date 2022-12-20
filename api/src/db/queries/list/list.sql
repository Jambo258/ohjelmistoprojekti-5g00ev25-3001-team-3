/*
  @name getList
*/
SELECT product_id FROM user_products WHERE user_id = :user_id;

/*
  @name addListItem
*/
INSERT INTO user_products(product_id, user_id) VALUES (:product_id!, :user_id!) RETURNING product_id;

/*
  @name deleteListItem
*/
DELETE FROM user_products
WHERE user_id = :user_id! AND product_id = :product_id!
RETURNING product_id;