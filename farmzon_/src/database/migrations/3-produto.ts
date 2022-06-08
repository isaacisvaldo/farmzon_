import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('produto', (table)=>{
        table.increments('idProduto').primary();
        table.string('nomeProduto').notNullable();
        table.string('imgProduto').notNullable();
        table.string('descProduto').defaultTo("Descrição");
        table.string('stockProduto').defaultTo("Descrição");
        table.integer('precoProduto').notNullable();
        table.integer('idCategoria').notNullable().references('idCategoria').inTable('categoria');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('produto')
}

//nome, idProfessor, data-inicio, data-fim, image, desc, estado