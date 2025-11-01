INSERT INTO permits (id, display_name, description)
VALUES
('order:read', 'отримувати замовлення', NULL),
('order:update-status', 'оновлювати статус замовлення', NULL),
('order:cancle', 'Відмінити замовлення', NULL),
('opening:read', 'Перевірити час відкриття', NULL),
('opening:update', 'оновлювати час відкриття', NULL)
ON CONFLICT (id) DO NOTHING; 


INSERT INTO permit_in_role (role_id, permit_id)
SELECT 'owner', id FROM permits
ON CONFLICT (role_id, permit_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS opening_hours (
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6) PRIMARY KEY,
  opens_at TIME WITHOUT TIME ZONE,
  closes_at TIME WITHOUT TIME ZONE
);

INSERT INTO opening_hours (day_of_week, opens_at, closes_at)
VALUES
(0,null,null),
(1,null,null),
(2,null,null),
(3,null,null),
(4,null,null),
(5,null,null),
(6,null,null)
ON CONFLICT (day_of_week) DO NOTHING;

-- TODO: move in to init file

ALTER TABLE about ADD address VARCHAR(255);