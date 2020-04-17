DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAl PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);