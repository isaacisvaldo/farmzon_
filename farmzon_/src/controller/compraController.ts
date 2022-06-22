import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import compra from '../config/compra';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c,day,dataAtual } from '../config/data'
import farmAuth from '../middlewre/farm'
import clinteAuth from '../middlewre/cliente'

const CompraController=Router();

//Vendas(Compras)--------------- ADMIN-----------------------------------------------------------
CompraController.post('/comprarVenda',upload.single('image'),async(req:Request, resp: Response)=>{
  const { idProduto, quantidadeCompra, enderecoCompra}=req.body;  
  const estadocompra=0;
  const data=new Date();
  console.log(data);
  const dia=(""+data).substring(8,10);
  const ano=data.getFullYear();
  const horaCompra=data.getHours();
  const mes=data.getMonth()+1
  const idCliente=req.session?.user.id;
  const comprovativoCompra=req.file?.filename
  let resultado:any=[];

  compra(idProduto, quantidadeCompra, estadocompra, mes, dia, enderecoCompra, ano, idCliente, comprovativoCompra,horaCompra, resultado)
  .then(c=>{
    console.log(c);
    if(c.indexOf('Diminua o Stock')==-1 || c.indexOf("Estoque Insuficiente")==-1){
      req.flash('certo', 'Compra Efectuada, aguardar Verificação')
      resp.redirect('/perfil')
    }else{
      req.flash('errado', 'Stock Insuficiente ou Produtos indisponivel')
      resp.redirect('/perfil')
    }
    ///perfil
  })

  
   

  
})


CompraController.get('/listarCompras',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const compra= await knex('compra')
    .join('cliente', 'compra.idCliente', 'cliente.idCliente')
    .join('produto', 'compra.idProduto', 'produto.idProduto')
    .select('*')
    if(compra){
      resp.render('Farmaceutico/listarCompra',{farmaceutico,compra,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
CompraController.get('/detalhesCompra/:idCompra',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idCompra, stockProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const compra= await knex('compra')
    .join('cliente', 'compra.idCliente', 'cliente.idCliente')
    .join('produto', 'compra.idProduto', 'produto.idProduto')
    .where('idCompra',idCompra )
    .first();
    const categoria=await knex('categoria').where('idCategoria',compra.idCategoria).first()
//Clientes Autenticados
CompraController.post('/Comprar',farmAuth,async(req:Request, resp: Response)=>{
  
 
})


    if(compra){
      resp.render('Farmaceutico/detalhesCompra',{farmaceutico,compra,categoria,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})

/**
 * 
 * 
 * 
 * const produto= await knex('produto').where('idProduto', idProduto).first();
  if(produto.stockProduto>1){
    const p=produto.stockProduto;
    const c=produto.stockProduto-quantidadeCompra;
    
    if(c<0 || quantidadeCompra>p){
      resp.json({error:'Não pode Efectuar a Compra, diminua a quantidade, Stock insuficiente: '+produto.stockProduto})
    }else{     
      const dd=await knex('produto').where('idProduto', idProduto).update({stockProduto:c});      
      const aa= await knex('produto').where('idProduto', idProduto).first();
      const compraEfectuada= await knex('compra')
      .insert({estadocompra, mes, dia, ano,enderecoCompra, idProduto, idCliente,debitoCompra, quantidadeCompra, horaCompra})
      const listaCompra= await knex('compra').where('idCompra',compraEfectuada[0]).first();
      resp.json({ listaCompra, produto:aa})
    }
  }else{
    resp.json({error:'Stock insuficiente: '+produto.stockProduto})
  }
 */




export default CompraController;



