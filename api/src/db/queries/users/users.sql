/* @name getAllUsers */
SELECT id, username, created_at, last_login, role FROM users;

/* @name getUser */
SELECT id, username, created_at, last_login, role 
FROM users
WHERE id = :id!;

/*
 @name addUser
 @param user -> (username, password)
*/
INSERT INTO users (username, password)
VALUES :user!
RETURNING id, username, created_at, last_login, role;

/*
  @name updateUser
*/
UPDATE users SET
    username = COALESCE(:username, username),
    password = COALESCE(:password, password),
    role = COALESCE(:role, role)
WHERE id = :id!
AND (:username :: VARCHAR(255) IS NOT NULL AND :username IS DISTINCT FROM username OR
     :password :: VARCHAR(60) IS NOT NULL AND :password IS DISTINCT FROM password OR
     :role :: user_roles IS NOT NULL AND :role IS DISTINCT FROM role)
RETURNING id, username, created_at, last_login, role;

/* @name getUserAuthInfo */
SELECT * FROM users WHERE username = :username!;

/* @name deleteUser */
DELETE FROM users
WHERE id = :id!
RETURNING id, username, created_at, last_login, role;