DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    image VARCHAR(1000),
    isbn VARCHAR(20),
    description VARCHAR(255),
    bookshelf VARCHAR(255)
);

INSERT INTO books (title,author, image, isbn,description,bookshelf) VALUES('book one','book two','bla', 'bla', 'explanation', 'shelf 1');