/* 
  @name addProduct
*/
INSERT INTO products(ean) VALUES (:ean!) ON CONFLICT (ean) DO NOTHING;

/*
  @name addReview
*/
INSERT INTO products_review(user_id, product_id, body, rating)
VALUES (:user_id!, :product_id!, :body!, :rating!)
RETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id; 

/*
  @name deleteReview
*/
DELETE FROM products_review
WHERE user_id = :user_id! AND product_id = :product_id!
RETURNING (SELECT username FROM users WHERE id = user_id), product_id, body, rating, user_id; 

/*
  @name getReviews
*/
SELECT users.username, products_review.product_id, products_review.body, products_review.rating, products_review.user_id FROM products_review
INNER JOIN users ON products_review.user_id = users.id
WHERE products_review.product_id = :product_id!;