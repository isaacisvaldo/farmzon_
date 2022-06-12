import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('compra', (table)=>{
        table.increments('idCompra').primary();
        table.timestamp('datacompra').defaultTo(knex.fn.now());
        table.string('estadocompra').notNullable();
        table.string('mes').notNullable();
        table.string('dia').notNullable();
        table.string('ano').notNullable();
        table.string('aenderecoEntrega').notNullable();
        table.integer('idProduto').notNullable().references('idProduto').inTable('produto');
        table.integer('idCliente').notNullable().references('idCliente').inTable('cliente');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('compra')
}

//dataMarcacao, estadoMarcacao, mes, dia, ano, diaExtenso, idPaciente,idMedico