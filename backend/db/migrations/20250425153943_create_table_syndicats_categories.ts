import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("categories", function (table) {
        table.increments("category_id").primary();
        table.string("name").notNullable();
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table.timestamp("creation_date").defaultTo(knex.fn.now());

        table.engine('InnoDB');
        table.charset('utf8mb4');
    })

    await knex.schema.createTable("syndicats_categories", function (table) {
        table.increments("id").primary();
        table.integer("syndicat_id").unsigned().notNullable();
        table.integer("category_id").unsigned().notNullable();
        table.boolean("is_hidden").defaultTo(false)
        table.timestamp("creation_date").defaultTo(knex.fn.now());
        table.timestamp("update_date").defaultTo(knex.fn.now());

        table.unique(["syndicat_id", "category_id"]);
        table.foreign("syndicat_id").references("syndicats.syndicat_id")

        table.engine('InnoDB');
        table.charset('utf8mb4');
    })

    await knex.raw(`
        CREATE TRIGGER update_syndicats_categories_timestamp
        BEFORE UPDATE ON syndicats_categories
        FOR EACH ROW
        BEGIN
            SET NEW.update_date = CURRENT_TIMESTAMP;
        END;
    `);

}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TRIGGER IF EXISTS update_syndicats_categories_timestamp`);
    await knex.schema.dropTableIfExists("syndicats_categories");
    await knex.schema.dropTableIfExists("categories");
}

