
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN 
    IF not EXISTS (
        SELECT 1 from pg_type WHERE typname = 'payment_method'
    ) THEN
        CREATE TYPE payment_method AS ENUM (
            'CARD_ONLINE',       -- Оплата банківською карткою онлайн
            'CARD_ON_DELIVERY',  -- Оплата карткою при отриманні (через POS-термінал)
            'CASH_ON_DELIVERY',  -- Оплата готівкою при отриманні
            'BANK_TRANSFER',     -- Банківський переказ (для корпоративних клієнтів)
            'PAYPAL',            -- PayPal або інші сторонні платіжні системи
            'APPLE_PAY',         -- Apple Pay / Google Pay
            'GIFT_CARD'          -- Подарункова картка
        );
    END IF;
END
$$;

DO $$ 
BEGIN 
    IF not EXISTS (
        SELECT 1 from pg_type WHERE typname = 'order_status'
    ) THEN

        CREATE TYPE order_status AS ENUM (
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        );
    END IF;
END
$$;



CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    payment payment_method NOT NULL,
    amount DECIMAL(7,2) NOT NULL,
    enc_phone VARCHAR(255) NOT NULL,
    customer_name VARCHAR(50) NOT NULL,
    delivery BOOLEAN NOT NULL,
    street VARCHAR(100) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    enc_address_full VARCHAR(255),
    enc_address_clarification VARCHAR(255),
    description TEXT,
    enc_email VARCHAR(255) DEFAULT NULL
);

DO $$
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_order_timestamp'
    ) THEN 
        CREATE TRIGGER set_order_timestamp
        BEFORE UPDATE ON orders 
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    END IF;
END;
$$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customer_order_phone_hashes (
hash_phone CHAR(60) NOT NULL,
order_id INTEGER NOT NULL,
PRIMARY KEY (hash_phone, order_id),

    CONSTRAINT fk_order
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_customer_order_hash_phone ON customer_order_phone_hashes (hash_phone);

CREATE TABLE IF NOT EXISTS menu_item_in_order (
    order_id INTEGER NOT NULL, 
    menu_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (order_id, menu_id),

    CONSTRAINT fk_order
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_menu
    FOREIGN KEY (menu_id)
    REFERENCES menu (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_menuItem_in_order_time ON menu_item_in_order (created_at);