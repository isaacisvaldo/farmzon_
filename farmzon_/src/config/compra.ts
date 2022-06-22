  import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c,day,dataAtual } from '../config/data'
import farmAuth from '../middlewre/farm'
import clinteAuth from '../middlewre/cliente'
  
  
  

  const compra=async (idProduto:any, quantidadeCompra:any, estadocompra:any, mes:any, dia:any, enderecoCompra:any, ano:any, idCliente:any, comprovativoCompra:any,horaCompra:any, resultado:any)=>{
    for (let index = 0; index < idProduto.length; index++) {
    const produto= await knex('produto').where('idProduto', idProduto[index]).first();
    if(produto.stockProduto>1){
    const p=produto.stockProduto;
    const c=produto.stockProduto-quantidadeCompra[index];
    const debitoCompra=quantidadeCompra[index]*produto.precoProduto;
    if(c<0 || quantidadeCompra[index]>p){
       resultado.push('Diminua o Stock')
      
    }else{     
      const dd=await knex('produto').where('idProduto', idProduto).update({stockProduto:c});      
      const aa= await knex('produto').where('idProduto', idProduto).first();
      const compraEfectuada= await knex('compra')
      .insert({debitoCompra,estadocompra, mes, dia, ano,enderecoCompra, idProduto:idProduto[index], idCliente, quantidadeCompra:quantidadeCompra[index],comprovativoCompra, horaCompra})
      const listaCompra= await knex('compra').where('idCompra',compraEfectuada[0]).first();
       resultado.push("Realizado")
     
    }
  }else{
     resultado.push("Estoque Insuficiente")
        
  }

  }
  return resultado;

  }

  export default compra;
