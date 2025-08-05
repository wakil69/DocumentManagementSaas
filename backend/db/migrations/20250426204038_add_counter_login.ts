import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.integer("login_counter").defaultTo(0); 
    table.timestamp("last_logged_in").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("login_counter");
    table.dropColumn("last_logged_in");
  });
}