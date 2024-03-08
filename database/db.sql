--Es la sintaxis para crear la base de datos en MySQL
CREATE DATABASE database_rolestest;

USE database_rolestest;

--Tabla de usuarios
CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    phone BIGINT(100) NOT NULL,
    role VARCHAR(100) DEFAULT 'regular'
);

ALTER TABLE users
ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE users;

-- Tablas de citas
CREATE TABLE links (
    id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    fecha Date,
    hora Time,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE links 
    ADD PRIMARY KEY (id);

ALTER TABLE links  
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE links;