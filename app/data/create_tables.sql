BEGIN;

DROP TABLE IF EXISTS "trees", "commands", "users", "commands_has_trees";

CREATE TABLE "trees" (
  "id" INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "name" VARCHAR(32) NOT NULL UNIQUE,
  "image" VARCHAR(255),
  "variety" VARCHAR(32),
  "size" DECIMAL,
  "price_ht" DECIMAL,
  "price_ttc" DECIMAL,
  "origin" VARCHAR(64),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "users" (
  "id" INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "role" VARCHAR(32) NOT NULL,
  "lastname" VARCHAR(32) NOT NULL,
  "firstname" VARCHAR(32) NOT NULL,
  "adress" VARCHAR(255) NOT NULL,
  "mail" VARCHAR(255) NOT NULL,
  "password" VARCHAR(32) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "commands" (
  "id" INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "date" TIMESTAMPTZ NOT NULL,
  "statut" VARCHAR(255) NOT NULL,
  "total_price" DECIMAL NOT NULL,
  "user_id" INT NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "commands_has_trees" (
  "id" INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "tree_id" INT NOT NULL REFERENCES "trees"("id"),
  "command_id" INT NOT NULL REFERENCES "commands"("id"),
  "quantity" INT NOT NULL
);

COMMIT;