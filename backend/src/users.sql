/* 
 @name InsertUser 
 @param user -> (name)
 */
INSERT INTO
    users (name)
VALUES
    :user RETURNING *;

/* @name FindUserById */
SELECT
    *
FROM
    users
WHERE
    id = :id;

/* @name FindUsers */
SELECT
    *
FROM
    users
WHERE
    name ILIKE '%' || :name || '%'
    OR :name IS NULL;

/* @name DeleteUser */
DELETE FROM
    users
WHERE
    id = :id;