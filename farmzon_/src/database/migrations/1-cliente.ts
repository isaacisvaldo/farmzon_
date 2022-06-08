import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('cliente', (table)=>{
        table.increments('idCliente').primary();
        table.string('imgCliente').notNullable();
        table.string('nomeCliente').notNullable();
        table.string('userCliente').notNullable();
        table.string('emailCliente').notNullable();
        table.string('tellCliente').notNullable();
        table.string('generoCliente').defaultTo("M");
        table.string('senhaCliente').notNullable();
        table.integer('estadoCliente').notNullable();
        table.integer('role').notNullable();
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('cliente')
}

//idCliente, imgCliente, nomeCliente, userCliente, emailCliente,tellCliente,senhaCliente,estadoCliente