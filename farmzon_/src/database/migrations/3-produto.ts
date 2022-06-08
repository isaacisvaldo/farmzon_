import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('produto', (table)=>{
        table.increments('idProduto').primary();
        table.string('nomeProduto').notNullable();
        table.string('imgProduto').notNullable();
        table.string('descProduto').defaultTo("Descrição");
        table.integer('stockProduto').defaultTo(0);
        table.integer('precoProduto').notNullable();
        table.integer('estadoProduto').notNullable();
        table.integer('idCategoria').notNullable().references('idCategoria').inTable('categoria');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('produto')
}

//nomeProduto, imgProduto, descProduto, stockProduto,precoProduto,estadoProduto, idCategoria