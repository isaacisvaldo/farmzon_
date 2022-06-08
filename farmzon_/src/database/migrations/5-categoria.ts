import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('categoria', (table)=>{
        table.increments('idCategoria').primary();
        table.string('nomeCategoria').notNullable();
        table.string('desCategoria').notNullable();
      
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('categoria')
}
