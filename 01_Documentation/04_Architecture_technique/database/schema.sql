-- PaySafe — Schéma relationnel (PostgreSQL) — 2026-05-28

CREATE TYPE transaction_status AS ENUM (
    'PENDING_PAYMENT',
    'FUNDS_ESCROWED',
    'DELIVERED_TO_BUYER',
    'COMPLETED',
    'RETURN_INITIATED',
    'RETURNED_TO_SELLER',
    'DISPUTE'
);

CREATE TYPE notification_type AS ENUM (
    'NEW_MESSAGE',
    'STATUS_CHANGED',
    'PAYMENT_RECEIVED',
    'SYSTEM'
);

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    fedapay_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES Users(user_id),
    seller_id INT REFERENCES Users(user_id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    fees NUMERIC(10, 2) NOT NULL,
    status transaction_status DEFAULT 'PENDING_PAYMENT',
    fedapay_transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES Transactions(transaction_id) ON DELETE CASCADE,
    sender_id INT REFERENCES Users(user_id),
    message_text TEXT NOT NULL,
    attachment_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    transaction_id INT REFERENCES Transactions(transaction_id) ON DELETE SET NULL,
    type notification_type NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
