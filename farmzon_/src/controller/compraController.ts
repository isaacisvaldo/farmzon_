import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c,day,dataAtual } from '../config/data'
import farmAuth from '../middlewre/farm'
import clinteAuth from '../middlewre/cliente'

const CompraController=Router();

//Vendas(Compras)--------------- ADMIN-----------------------------------------------------------
CompraController.get('/Vendas',farmAuth,async(req:Request, resp: Response)=>{
  const produtos = await knex('compra').select('*');
  resp.render('DashBoard/clientes',{produtos})
})
CompraController.get('/Compra/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const compra = await knex('compra').where('idCompra',id).select('*')
  if(compra){
   
  }else{
resp.redirect("/404")
  }
})
CompraController.get('/Compradeletar/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const compra= await knex('compra').where('idCompra',id).delete()
   resp.send('Deletado...')
 
})

//Clientes Autenticados


//Fim Clientes autenticados


//Clientes Não Autenticados

//Fim Cliente Não Autenticados


export default CompraController;

//image, name, email, whatsaap, nomeuser senha

