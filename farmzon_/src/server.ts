import express from "express";
import route from './Routes'
import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";
import flash from 'express-flash'
import session from 'express-session'
import CompraController from './controller/compraController';
import ClienteController from './controller/clienteController';
import FarmaceuticoController from './controller/farmaceuticoController';
import CategoriaController from './controller/categoriaController';

import knex from './database/conection';

//node-cron
import c from  './config/marcacoes'

const app= express();
app.use(flash())

app.use(session({
    secret:'ineforLearning',
    cookie:{maxAge: 3000000000}
}))

app.use('/upload', express.static(path.resolve(__dirname, '..','upload')) );
app.use(express.static(path.resolve(__dirname, '..','public')))
app.set('view engine', 'ejs')
app.use(cors());


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(route);
app.use(ClienteController);
app.use(FarmaceuticoController);
app.use(CompraController);
app.use(CategoriaController);



app.use(async(req,res, next)=>{  
    res.render("error/page-404")
}) 



app.listen(1002, () => {
    console.log('Rodando,Port: 1002');
})