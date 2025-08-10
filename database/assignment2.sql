-- Inserting data to the account table

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
Values ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modifiying data
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND
account_lastname = 'Stark';

-- deleting data
DELETE FROM public.account 
WHERE account_firstname = 'Tony' AND
account_lastname = 'Stark';

-- 	Replacing  data
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- Join de data
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification 
  ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 	Updating  data
UPDATE public.inventory
SET 
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

UPDATE public.account
SET account_type = 'Employee'
WHERE account_email = 'happy@340.edu';
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';



DROP TABLE IF EXISTS classification_history;

CREATE TABLE classification_history (
  history_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(100) NOT NULL,
  action VARCHAR(20) NOT NULL, -- Ej: 'ADD', 'UPDATE', 'DELETE'
  user_id INT,
  change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES account(account_id) ON DELETE SET NULL
);


DROP TABLE IF EXISTS vehicle_history;

CREATE TABLE vehicle_history (
  history_id SERIAL PRIMARY KEY,
  inv_id INT NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  added_by INT, -- ID del usuario que agregó
  change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inv_id) REFERENCES inventory(inv_id) ON DELETE CASCADE,
  FOREIGN KEY (added_by) REFERENCES account(account_id) ON DELETE SET NULL
);
