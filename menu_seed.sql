-- 1. Add yield_ratio column if it does not exist
alter table ingredients add column if not exists yield_ratio numeric(4,3) default 1.000;

-- 2. Insert/Update Ingredients with their yield ratios
insert into ingredients (id, name, category, price_per_oz, protein_per_oz, carbs_per_oz, fat_per_oz, calories_per_oz, yield_ratio)
values
  -- Proteins (Shrinkage: 4oz cooked requires more raw weight)
  ('sirloin', 'Sirloin Steak', 'protein', 0.650, 7.0, 0, 2.0, 46, 0.708), -- Yields ~70.8% (5.65oz raw -> 4oz cooked)
  ('ground_turkey', 'Turkey Meatballs', 'protein', 0.271, 7.0, 0, 2.5, 51, 0.800), -- Yields ~80.0%
  ('chicken_breast', 'Chicken Breast', 'protein', 0.165, 8.5, 0, 1.0, 43, 0.750), -- Yields ~75.0%
  ('chicken_thigh', 'Chicken Thigh', 'protein', 0.107, 7.0, 0, 3.0, 55, 0.700), -- Yields ~70.0%
  ('eggs', 'Scrambled Eggs', 'protein', 0.180, 3.6, 0.3, 2.8, 41, 0.950),
  ('greek_yogurt', 'Vanilla Greek Yogurt', 'protein', 0.150, 3.0, 1.0, 0, 16, 1.000),
  ('cottage_cheese', 'Cottage Cheese', 'protein', 0.120, 3.5, 1.0, 0.5, 23, 1.000),
  ('lean_meat', 'Lean Meat', 'protein', 0.300, 7.5, 0, 1.5, 45, 0.800),
  
  -- Carbs (Absorption: cooked weight is larger than dry/raw weight)
  ('mashed_potato', 'Garlic Mashed Potato', 'carb', 0.103, 0.6, 5.0, 1.0, 31, 1.000),
  ('sweet_potato', 'Mashed Sweet Potato', 'carb', 0.083, 0.6, 6.0, 0, 26, 1.000),
  ('jasmine_rice', 'Jasmine Rice', 'carb', 0.021, 0.7, 8.0, 0, 35, 2.500), -- Cooked weight is 2.5x dry weight
  ('fried_rice', 'Fried Rice Mix', 'carb', 0.045, 1.0, 8.0, 0.5, 40, 2.500),
  ('pasta', 'Pasta Noodles', 'carb', 0.036, 1.5, 8.0, 0.2, 40, 3.000), -- Cooked weight is 3x dry weight
  ('granola', 'Granola', 'carb', 0.100, 0.5, 6.0, 1.0, 35, 1.000),
  ('pretzel', 'Pretzel Sticks', 'carb', 0.080, 0.8, 7.0, 0.2, 33, 1.000),
  
  -- Veggies / Others
  ('broccoli', 'Broccoli', 'veg', 0.133, 0.8, 2.0, 0, 11, 0.900), -- 10% steam shrinkage
  ('green_beans', 'Green Beans', 'veg', 0.099, 0.5, 2.0, 0, 10, 0.900),
  ('mixed_veg', 'Mixed Vegetables', 'veg', 0.110, 0.6, 2.0, 0.1, 11, 0.900)
on conflict (id) do update set
  name = excluded.name,
  price_per_oz = excluded.price_per_oz,
  protein_per_oz = excluded.protein_per_oz,
  carbs_per_oz = excluded.carbs_per_oz,
  fat_per_oz = excluded.fat_per_oz,
  calories_per_oz = excluded.calories_per_oz,
  yield_ratio = excluded.yield_ratio;

-- 3. Clean out old meals and insert the new 19 Meals
truncate table customer_meal_selections cascade;
truncate table meals cascade;

insert into meals (name, category, protein_ingredient_id, carb_ingredient_id, veg_ingredient_id, is_active)
values
  -- Breakfast
  ('Steak and Eggs', 'breakfast', 'sirloin', 'mashed_potato', 'green_beans', true),
  ('Loaded Breakfast Bowl', 'breakfast', 'eggs', 'mashed_potato', 'broccoli', true),
  ('Yogurt Parfait', 'breakfast', 'greek_yogurt', 'granola', 'green_beans', true),
  ('Honey Sweet Cottage Cheese', 'breakfast', 'cottage_cheese', 'granola', 'green_beans', true),
  
  -- Snack
  ('Meat & Cheese-To-Go (Pack of 5)', 'snack', 'lean_meat', 'pretzel', 'green_beans', true),
  
  -- Lunch / Dinner Mains
  ('Steak n Mash', 'lunch', 'sirloin', 'mashed_potato', 'green_beans', true),
  ('Chicken Fried Rice', 'lunch', 'chicken_breast', 'fried_rice', 'green_beans', true),
  ('Chile Margarita', 'lunch', 'chicken_breast', 'jasmine_rice', 'mixed_veg', true),
  ('Asian Zing', 'lunch', 'chicken_thigh', 'jasmine_rice', 'mixed_veg', true),
  ('BBQ Chicken Thigh', 'dinner', 'chicken_thigh', 'sweet_potato', 'green_beans', true),
  ('Spaghetti and Meatballs', 'dinner', 'ground_turkey', 'pasta', 'broccoli', true),
  ('Roasted Ranch', 'lunch', 'chicken_thigh', 'jasmine_rice', 'mixed_veg', true),
  ('Mashed Buffalo', 'lunch', 'chicken_breast', 'mashed_potato', 'mixed_veg', true),
  ('Chipotle Burrito Bowl', 'lunch', 'chicken_breast', 'jasmine_rice', 'mixed_veg', true),
  ('Pesto Chicken Pasta', 'dinner', 'chicken_breast', 'pasta', 'broccoli', true),
  ('Teriyaki Chicken', 'lunch', 'chicken_breast', 'jasmine_rice', 'broccoli', true),
  ('Sweet Chili Chicken Thigh', 'dinner', 'chicken_thigh', 'jasmine_rice', 'green_beans', true),
  ('Buttery Chicken', 'lunch', 'chicken_breast', 'jasmine_rice', 'broccoli', true),
  ('Chicken Alfredo', 'dinner', 'chicken_breast', 'pasta', 'broccoli', true);
