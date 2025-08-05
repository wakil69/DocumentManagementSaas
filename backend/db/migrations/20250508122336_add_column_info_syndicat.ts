import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("syndicats", function (table) {
        table.text("infos").nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("syndicats", function (table) {
        table.dropColumn("infos")
    })
}
