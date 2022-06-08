import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('farmaceutico', (table)=>{
        table.increments('idFarmaceutico').primary();
        table.string('nomeFarmaceutico').notNullable();
        table.string('imgFarmaceutico').notNullable().defaultTo('user.png');
        table.timestamp('dataFarmaceutico').defaultTo(knex.fn.now())
        table.string('userFarmaceutico').notNullable();
        table.string('emailFarmaceutico').notNullable();
        table.string('tellFarmaceutico').notNullable();
        table.string('senhaFarmaceutico').notNullable();
        table.string('generoFarmaceutico').notNullable();
        table.string('descFarmaceutico').notNullable();
        table.integer('role').notNullable();
        
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('farmaceutico')
}

//nome, nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico, passFarmaceutico