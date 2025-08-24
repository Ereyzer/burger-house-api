-- database/init.sql
-- TODO: create structure

--TODO:  tables for personal and they permissions
-- create table roles
CREATE TABLE IF NOT EXISTS roles (
  Id VARCHAR(10) PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(150)
);

-- comments for table roles
COMMENT ON TABLE roles IS 'Storage table for roles of personal.';
COMMENT ON COLUMN roles.id IS 'Unique role id (for example, "admin", "employee", "manager", "owner").';
COMMENT ON COLUMN roles.display_name IS 'Display role name for user interface.';
COMMENT ON COLUMN roles.description IS 'description about role.';

INSERT INTO roles (id, display_name, description)
VALUES 
('owner', 'власник', 'Максимальний доступ до усіх налаштувань включає в себе усі дозволи.'),
('admin', 'адміністратор', 'можливість надавати тимчасово більшу кількісь повноважень для розробників'),
('manager', 'менеджер', NULL),
('employee', 'працівник', NULL)
ON CONFLICT (id) DO NOTHING; 

-- create table permisions
CREATE TABLE IF NOT EXISTS permits (
  id VARCHAR(50) PRIMARY KEY, -- Unique permit name (for example, "products:read", "users:manage")
  display_name VARCHAR(50) NOT NULL,
  description VARCHAR(150) 
);

-- comments for table permits
COMMENT ON TABLE permits IS 'Storage table for permits of personal.';
COMMENT ON COLUMN permits.id IS 'Unique name of permit (for example, "products:read").';
COMMENT ON COLUMN permits.display_name IS 'dsplay name for user interface.';
COMMENT ON COLUMN permits.description IS 'explain why this permit you need.';

-- TODO: insert some permissions
INSERT INTO permits (id, display_name, description)
VALUES
('personal:add', 'Додати користовача', 'можливість додавати нових користовачів в таблицю personal'),
('personal:role', 'Оновлення ролі', 'можливість оновлювати ролі користувачів'),
('personal:info', 'Оновлення персональних даних', 'Можливість оновити персональні дані'),
('manager:info', 'Оновити менеджера', 'Можливість оновити персональні дані працівника з дозволом "manager"'),
('employee:add', 'Додати працівника', 'Можливість додати працівника з дозволом "employee"'),
('employee:info', 'Оновити працівника', 'Можливість оновити персональні дані працівника з дозволом "employee"'),
('employee:delete', 'Видалити працівника', 'Можливість видалити працівника з дозволом "employee"'),
('menu:add', 'Додати позицію', 'Можливість додати в меню'),
('menu:delete', 'Видалити позицію ', 'Можливість видалити з меню'),
('menu:update', 'Оновити позицію', 'Можливість оновити інформацію про позицію меню'),
('menu:onboard', 'Статус позиції', 'Можливість змінити статус наявності позиції меню'),
('drink:add', 'Додати напій', NULL),
('drink:update', 'Оновити напій', NULL),
('drink:delete', 'Видалити напій', NULL),
('dish:add', 'Додати страву', NULL),
('dish:update', 'Оновити страву', NULL),
('dish:delete', 'Видалити страву', NULL)
ON CONFLICT (id) DO NOTHING; 

CREATE TABLE IF NOT EXISTS permit_in_role (
  role_id VARCHAR(10) NOT NULL,
  permit_id VARCHAR(50) NOT NULL,

  PRIMARY KEY (role_id, permit_id),

  CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES roles (id)
    ON DELETE CASCADE ON UPDATE CASCADE, 

  CONSTRAINT fk_permit
    FOREIGN KEY (permit_id)
    REFERENCES permits (id)
    ON DELETE CASCADE ON UPDATE CASCADE 

);

-- Cmments for table permit_in_role
COMMENT ON TABLE permit_in_role IS 'Таблиця зв''язку, що визначає, які дозволи належать до яких ролей.';
COMMENT ON COLUMN permit_in_role.role_id IS 'Ідентифікатор ролі, зовнішній ключ до таблиці roles.';
COMMENT ON COLUMN permit_in_role.permit_id IS 'Ідентифікатор дозволу, зовнішній ключ до таблиці permits.';

-- 1. add all permits to owner
INSERT INTO permit_in_role (role_id, permit_id)
SELECT 'owner', id FROM permits
ON CONFLICT (role_id, permit_id) DO NOTHING;

-- 2. add permits to manager
INSERT INTO permit_in_role (role_id, permit_id)
SELECT 'manager', id FROM permits
WHERE id LIKE 'menu:%' OR id LIKE 'drink:%' OR id LIKE 'dish:%' OR id LIKE 'employee:%' OR id='manager:info'
ON CONFLICT (role_id, permit_id) DO NOTHING;

-- 3. add permit onboard to 'employee'
INSERT INTO permit_in_role (role_id, permit_id)
VALUES 
('employee', 'menu:onboard'),
('employee', 'employee:info')
ON CONFLICT (role_id, permit_id) DO NOTHING;



-- Create table persons
CREATE TABLE IF NOT EXISTS personal (
  id SMALLSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  phone VARCHAR(255),
  name VARCHAR(255),
  surname VARCHAR(255),
  father_name VARCHAR(252),
  birthday DATE,
  address VARCHAR(255),
  picture VARCHAR(255), -- url on picture
  role_id VARCHAR(10) REFERENCES roles (id)
);

COMMENT ON TABLE personal IS 'Storage info about personal of restorant.';
COMMENT on COLUMN personal.role_id IS 'role off user for permits';

-- TODO: table for restorant
-- create table about
CREATE TABLE IF NOT EXISTS about (
 id SMALLSERIAL PRIMARY KEY,
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  email VARCHAR(255),
  phone CHAR(9), --phone suport only ukrainian numbers +380 66 73 45 027 +380 3477 25053 
                  -- in format 667345027 (+380) is defoult and we add in in api 
  about_description TEXT -- description about our delyvery why we the best
);
-- Коментарі для таблиці about
COMMENT ON TABLE about IS 'Table for storage general information about our restoran.';
COMMENT ON COLUMN about.id IS 'Uniq id is 1 because is only one row.';
COMMENT ON COLUMN about.facebook IS 'URL-addres our page in Facebook.';
COMMENT ON COLUMN about.instagram IS 'URL-addres our page in Instagram.';
COMMENT ON COLUMN about.email IS 'Our email adress.';
COMMENT ON COLUMN about.phone IS 'Phne number to contact us.';
COMMENT ON COLUMN about.about_description IS 'detailed company description.';


--TODO:

CREATE TABLE IF NOT EXISTS drinks(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(5, 2) NOT NULL,
  calories SMALLINT NOT NULL,
  description TEXT
);

COMMENT ON TABLE drinks IS 'there is drinks we can chose for menu';
COMMENT ON COLUMN drinks.calories IS 'approximate number of calories in one drink';
COMMENT ON COLUMN drinks.price IS 'Max price is 999.99';

CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  price DECIMAL(5, 2) NOT NULL,
  name VARCHAR(255) NOT NULL
);

COMMENT ON TABLE dishes IS 'there is dishes we can chse for menu';

CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(6,2) NOT NULL,
  onboard BOOLEAN NOT NULL,
  image_small VARCHAR(255),
  image_medium VARCHAR(255),
  description TEXT,
  rating DECIMAL(3,2),
  calories SMALLINT
);

COMMENT ON TABLE menu IS 'there you can comdine dishes and drinks to some menu positions';
COMMENT ON COLUMN menu.price IS 'max price is 9999.99';
COMMENT ON COLUMN menu.onboard IS 'if this position is available';
COMMENT ON COLUMN menu.image_small IS 'URL to picture for cards';
COMMENT ON COLUMN menu.image_medium IS 'URL to picture for open cards';
COMMENT ON COLUMN menu.rating IS 'rating is with stars from 1.00 to 5.00';
COMMENT ON COLUMN menu.calories IS 'count of calories, that is for future feature';

CREATE TABLE IF NOT EXISTS drinks_in_menu (
  drink_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  PRIMARY KEY (drink_id, menu_id),
  
  CONSTRAINT fk_drink
  FOREIGN KEY (drink_id)
  REFERENCES drinks (id)
  ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_menu 
  FOREIGN KEY (menu_id)
  REFERENCES menu (id)
  ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE drinks_in_menu IS 'table for references which drink in which menu position';

CREATE TABLE IF NOT EXISTS dishes_in_menu (
  dish_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  PRIMARY KEY (dish_id, menu_id),
  
  CONSTRAINT fk_dish
  FOREIGN KEY (dish_id)
  REFERENCES dishes (id)
  ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_menu
  FOREIGN KEY (menu_id)
  REFERENCES menu (id)
  ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE dishes_in_menu IS 'table for references, with dish in wich menu position';

CREATE TABLE IF NOT EXISTS categiries (
  id VARCHAR(20) PRIMARY KEY,
  display_name VARCHAR(20) NOT NULL,
  description TEXT,
);

COMMENT ON TABLE categiries IS 'categiries for filter menu';
COMMENT on COLUMN categiries.Id IS 'id is string like "drink", "vegeterian" or "spicy"';

CREATE TABLE IF NOT EXISTS menu_in_categorie (
  categirie_id VARCHAR(20) NOT NULL,
  menu_id INTEGER NOT NULL,
  PRIMARY KEY (categirie_id, menu_id),

  CONSTRAINT fk_categorie
  FOREIGN KEY (categirie_id)
  REFERENCES categiries (id)
  ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_menu
  FOREIGN KEY (menu_id)
  REFERENCES menu (id)
  ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE menu_in_categorie IS 'this table explain wich dish in which categorie';

-- TODO: orders

-- TODO: dish in order

-- TODO: allergens

-- TODO: allergen in drink

-- TODO: ingredients

-- TODO: allergen in ingredient

-- TODO: ingredient in dish

-- TODO: discount

-- TODO: ............... NEXT WILL BE  IN SOME ANOTHER WAY
