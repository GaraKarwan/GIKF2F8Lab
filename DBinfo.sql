
-- SQLite
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS products (
    name varchar(32),
    description varchar(128),
    price INTEGER(16),
    picture varchar(250),
    id INTEGER PRIMARY KEY NOT NULL
    );

INSERT INTO products (name, description, price, picture) VALUES
    ('Naruto', 'An Anime series about ninjas.', 299, './images/narutocard.webp'),
    ('One Piece', 'An Anime series about pirates.', 199, './images/onepiececard.webp'),
    ('Fairy Tail', 'An Anime series about mages.', 399, './images/fairytailcard.jpg'),
    ('My Hero Academia', 'An Anime series about heroes.', 99, './images/heroacademycard.jpg');

CREATE TABLE IF NOT EXISTS users (
    email varchar(64) UNIQUE,
    firstname varchar(32),
    surname varchar(32),
    password varchar(32),
    username varchar(16),
    id INTEGER PRIMARY KEY NOT NULL
    );

INSERT INTO users (email, firstname, surname, password, username, id) VALUES
    ('h19karwg@du.se', 'Karwan', 'Gara','safepassword', 'Juantan', 1),
    ('h19phike@du.se', 'Philip', 'Kelli', 'safepassword2','BigPhil', 2),
    ('h19simgh@du.se', 'Simko', 'Ghaderi', 'safepassword3', 'ThaDon', 3),
    ('h19sakah@du.se', 'Sakeria', 'Kaysa', 'safepassword4', 'ZackAttack', 4);