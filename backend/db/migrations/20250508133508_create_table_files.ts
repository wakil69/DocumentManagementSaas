import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("files", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("syndicat_id").unsigned().notNullable();
    table.integer("category_id").unsigned().notNullable();
    table.string("file_name").notNullable();
    table.boolean("has_expired").defaultTo(false);
    table.timestamp("expiration_date").nullable();
    table.timestamp("creation_date").defaultTo(knex.fn.now());
    table.timestamp("update_date").defaultTo(knex.fn.now());

    table.foreign("user_id").references("users.user_id");
    table.foreign("syndicat_id").references("syndicats.syndicat_id");
    table.foreign("category_id").references("categories.category_id");

    table.unique(["syndicat_id", "category_id", "file_name"]);
    
    table.engine('InnoDB');
    table.charset('utf8mb4');
  });


  await knex.raw(`
    CREATE TRIGGER update_files_timestamp
    BEFORE UPDATE ON files
    FOR EACH ROW
    BEGIN
      SET NEW.update_date = CURRENT_TIMESTAMP;
    END;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS update_files_timestamp`);
  await knex.schema.dropTableIfExists("files");
}