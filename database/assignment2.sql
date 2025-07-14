/*-- Inserting data to the account table

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
account_lastname = 'Stark';*/

-- 	Replacing  data
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

/*-- Join de data
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification 
  ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';*/

-- 	Updating  data
UPDATE public.inventory
SET 
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');