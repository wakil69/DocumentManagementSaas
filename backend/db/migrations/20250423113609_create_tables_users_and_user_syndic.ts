import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable("users", function (table) {
        table.increments("user_id").primary();
        table.string("email", 255).notNullable().unique();
        table.string("password", 255).notNullable();
        table.boolean("first_login").defaultTo(true);
        table.enum("civilite", ["Mr", "Mme"]).nullable();
        table.string("surname", 100).notNullable();
        table.string("first_name", 100).notNullable();
        table.enum("role", ["admin", "user"]).notNullable().defaultTo("user");
        table.timestamp("creation_date").defaultTo(knex.fn.now());
        table.timestamp("update_date").defaultTo(knex.fn.now());

        table.engine('InnoDB');
        table.charset('utf8mb4');
    })

    await knex.schema.createTable("syndicats", function (table) {
        table.increments("syndicat_id").primary();
        table.string("name", 255).notNullable().unique();
        table.timestamp("creation_date").defaultTo(knex.fn.now());
        table.timestamp("update_date").defaultTo(knex.fn.now());

        table.engine('InnoDB');
        table.charset('utf8mb4');
    })

    await knex.schema.createTable("users_syndicats", function (table) {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.integer("syndicat_id").unsigned().notNullable();
        table.timestamp("creation_date").defaultTo(knex.fn.now());

        table.foreign("user_id").references("users.user_id").onDelete("CASCADE");
        table.foreign("syndicat_id").references("syndicats.syndicat_id").onDelete("CASCADE");

        table.engine('InnoDB');
        table.charset('utf8mb4');
    })

    await knex.raw(`
        CREATE TRIGGER update_users_timestamp
        BEFORE UPDATE ON users
        FOR EACH ROW
        BEGIN
            SET NEW.update_date = CURRENT_TIMESTAMP;
        END;
    `);

    await knex.raw(`
        CREATE TRIGGER update_syndicats_timestamp
        BEFORE UPDATE ON syndicats
        FOR EACH ROW
        BEGIN
            SET NEW.update_date = CURRENT_TIMESTAMP;
        END;
    `);

}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TRIGGER IF EXISTS update_users_timestamp`);
    await knex.raw(`DROP TRIGGER IF EXISTS update_syndicats_timestamp`);

    await knex.schema.dropTableIfExists("users_syndicats");
    await knex.schema.dropTableIfExists("syndicats");
    await knex.schema.dropTableIfExists("users");
}

