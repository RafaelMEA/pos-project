-- Role table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL
);

-- User table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(role_id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Customer table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Category table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL
);

-- Product table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    product_details TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    barcode TEXT UNIQUE,
    supplier TEXT,
    image TEXT,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Transaction table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transaction Item table
CREATE TABLE transaction_items (
    transaction_item_id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL
);


CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  expires_at TIMESTAMP NOT NULL
);

