import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import clienteAuth from '../middlewre/cliente'
import farmAuth from '../middlewre/farm'

import { Response, Request, Router, request } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
const ClienteController=Router();

import { date } from '@hapi/joi';
// import bCryptjs from 'bcryptjs
ClienteController.post('/Novocliente',async(req:Request, resp: Response)=>{

  const {nomeCliente, userCliente, emailCliente,tellCliente,senhaCliente,senhaCliente2,generoCliente}=req.body; 
 const estadoCliente = 1;
 const role= 2;
 if(!(nomeCliente===''|| userCliente===''|| emailCliente===''||tellCliente===''||senhaCliente===''||senhaCliente2===''||generoCliente==='')){
  const imgCliente= (req.file) ? req.file.filename : 'user.png';
  let re = /[A-Z]/;
  const hasUpper = re.test(userCliente);
  const verificaEspaco = /\s/g.test(userCliente);
  const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailCliente);
  const number = /^[9]{1}[0-9]{8}$/.test(tellCliente)
 if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
 
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastarCliente')
        
        // resp.redirect("/cadastrarCliente")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
          } else
             if (senhaCliente.length < 5) {
                req.flash('errado', "Senha muito fraca");
                resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
             } else
                if (senhaCliente != senhaCliente2) {
                   req.flash('errado', "Senha Diferentes");
                   resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
 
                } else if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
    
                }else{ 
                  const verify= await knex('cliente').where('emailCliente', emailCliente).orWhere('userCliente', userCliente)
                  if(verify.length===0){
                    const ids = await knex('cliente').insert({imgCliente, nomeCliente, userCliente, emailCliente,tellCliente,senhaCliente,estadoCliente,generoCliente,role}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("/cadastrarCliente")})
                   
                  
                    req.flash("certo","Criado com sucesso !")
                    resp.redirect("/loginGeral")
                   // resp.redirect("/loginGeral")
                  }else{
                    req.flash("errado","Este usuario ja esta cadastrado!")
                    resp.redirect("/cadastarCliente")
                    //resp.redirect("/cadastrarCliente")
                  
                   }
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")

 }
                   
})
//Cliente Autenticado
ClienteController.get("/Clientelogado",clienteAuth, async(req:Request, resp:Response) =>{
  const categoria= await knex('categoria').select('*');
  const categoria3= await knex('categoria').limit(3);
  const medicamentos= await knex('produto')
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const medicamentos3= await knex('produto').limit(3)
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const medicamentos3desc= await knex('produto').orderBy('idProduto','desc').limit(3)
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const id=req.session?.user.id;
  const cliente= await knex('cliente').where('idCliente', id).first();
  if(cliente){
    console.log(cliente)
    resp.render('Cliente/index',{categoria,categoria3,medicamentos3,medicamentos3desc, medicamentos,cliente,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
    resp.redirect("/404")
  }
})
ClienteController.get('/categoriascliente',clienteAuth,async (req:Request, resp: Response)=>{
  const categoria= await knex('categoria').select('*');
  const medicamentos= await knex('produto')
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
resp.render('Cliente/categorias', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
})
ClienteController.get('/categoriaprodutoslogado/:id',async (req:Request, resp: Response)=>{
  const {id}= req.params;
 const categoria= await knex('categoria').select('*');
 const categoria1= await knex('categoria').where('idCategoria',id).first();
 const medicamentos= await knex('produto').where('idCategoria',id).select('*');
resp.render('Cliente/categoria_produtos', {categoria,categoria1, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
})
ClienteController.get("/perfil",clienteAuth, async(req:Request, resp:Response) =>{
  const categoria= await knex('categoria').select('*');
  const categoria3= await knex('categoria').limit(3);
  const medicamentos= await knex('produto')
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const medicamentos3= await knex('produto').limit(3)
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const medicamentos3desc= await knex('produto').orderBy('idProduto','desc').limit(3)
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
  const id=req.session?.user.id;
  const cliente= await knex('cliente').where('idCliente', id).first();
  if(cliente){
    console.log(cliente)
    resp.render('Cliente/perfil',{categoria,categoria3,medicamentos3,medicamentos3desc, medicamentos,cliente,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
    resp.redirect("/404")
  }
})
ClienteController.post('/Pesquisarm',async (req:Request, resp: Response)=>{
  let {idCategoria, medicamento}= req.body;
  console.log(medicamento)
  const d=parseInt(idCategoria)
  const categoria= await knex('categoria').select('*');
  if(d==0){
      const m= await knex('produto')
      .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
      .select('*');
      const medicamentos= m.filter(x => x.nomeProduto.toUpperCase().includes(medicamento.toUpperCase()))
      console.log(medicamentos)
      
      resp.render('Cliente/produto_1', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
      const m= await knex('produto')
      .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
      .where('idCategoria',d)
      .select('*');
      const medicamentos= m.filter(x => x.nomeProduto.toUpperCase().includes(medicamento.toUpperCase()))
      resp.render('Cliente/produto_1', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
  }


})
ClienteController.post('/Atualizarcliente',async(req:Request, resp: Response)=>{

  const {nomeCliente,id, userCliente, emailCliente,tellCliente,generoCliente}=req.body; 

 if(!(nomeCliente===''|| userCliente===''|| emailCliente===''||tellCliente===''||generoCliente==='')){
  let re = /[A-Z]/;
  const hasUpper = re.test(userCliente);
  const verificaEspaco = /\s/g.test(userCliente);
  const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailCliente);
  const number = /^[9]{1}[0-9]{8}$/.test(tellCliente)
 if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
          } else
              if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")
    
                }else{ 
                  const ids = await knex('cliente').where('idCliente',id).update({nomeCliente, userCliente, emailCliente,tellCliente,generoCliente,}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");})
                  resp.json('Atualizou...')
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/cadastarCliente')
        // resp.redirect("/cadastrarCliente")

 }
                   
})

ClienteController.get("/listaClientes",farmAuth, async(req:Request, resp:Response) =>{
  try {
      const idUser=req.session?.user.id;
      const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser)
      const cliente= await knex('cliente').select('*')
      if(cliente){
        console.log(cliente)
        resp.render('Farmaceutico/clienteLista',{farmaceutico,cliente,certo:req.flash('certo'),errado:req.flash('errado')})
      }else{
        resp.redirect("/404")
    }    
  } catch (error) {
    console.log(error);
    resp.render("error/page-404")
  }

})


//cliente---------------------------------------------------------------------
ClienteController.get('/detalhesCliente/:idCliente',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idCliente, stockProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const cliente= await knex('cliente')
    .where('idCliente', idCliente)
    .first();

    const compras= await knex('compra')
    .join('produto', 'compra.idProduto', 'produto.idProduto')
    .join('cliente', 'compra.idCliente', 'cliente.idCliente')
    .where('compra.idCliente', idCliente)
    if(cliente){
      resp.render('Farmaceutico/detalhesCliente',{farmaceutico,compras, cliente,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})

ClienteController.get('/editarCliente/:idCliente',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idCliente}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();

    const categoria= await knex('categoria').select('*')
    const cliente= await knex('cliente')
    .where('idCliente', idCliente).first()
    if(cliente){
      // console.log(categoria)
      resp.render('Farmaceutico/editarCliente',{farmaceutico,categoria,cliente,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
ClienteController.post('/editarCliente',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idCliente, nomeCliente, tellCliente, emailCliente, userCliente}=req.body;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const verificaEspaco = /\s/g.test(userCliente);
    const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailCliente);
    const number = /^[9]{1}[0-9]{8}$/.test(tellCliente)
    if(nomeCliente==""){
      req.flash('errado', 'Dados Incorretos')
      resp.redirect('/editarCliente/'+idCliente)
    }else{
      const medicamentos= await knex('cliente').where('idCliente', idCliente).update({nomeCliente, tellCliente, emailCliente,userCliente})
      if(medicamentos){
        // console.log(categoria)
        req.flash('certo', 'Dados do Cliente Editado')
        resp.redirect('/detalhesCliente/'+idCliente)
      }else{
        resp.render("error/page-404")
    }

  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)

ClienteController.get('/removerCliente/:idCliente',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idCliente}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();

    const categoria= await knex('categoria').select('*');
    const compras = await knex('compra').where('idCliente', idCliente).del();
    const medicamentos= await knex('cliente').where('idCliente', idCliente).del();
    if(medicamentos){
      // console.log(categoria)
      req.flash('certo', 'Cliente Eliminado')
      resp.redirect('/listaClientes')
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
//Rotas cliente Não autenticado
ClienteController.get('/categoriasSite',async (req:Request, resp: Response)=>{
  const categoria= await knex('categoria').select('*');
  const medicamentos= await knex('produto')
  .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
  .select('*');
resp.render('Site/categorias', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
})
ClienteController.get('/categoriaprodutos/:id',async (req:Request, resp: Response)=>{
   const {id}= req.params;
  const categoria= await knex('categoria').select('*');
  const categoria1= await knex('categoria').where('idCategoria',id).first();
  const medicamentos= await knex('produto').where('idCategoria',id).select('*');
resp.render('Site/categoria_produtos', {categoria,categoria1, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
})
ClienteController.get('/Carinho',async (req:Request, resp: Response)=>{
  const {id}= req.params;
 const categoria= await knex('categoria').select('*');

 const medicamentos= await knex('produto')
 .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
 .select('*');
resp.render('Site/shop-cart', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
})
ClienteController.post('/Pesquisar',async (req:Request, resp: Response)=>{
  let {idCategoria, medicamento}= req.body;
  console.log(medicamento)
  const d=parseInt(idCategoria)
  const categoria= await knex('categoria').select('*');
  if(d==0){
      const m= await knex('produto')
      .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
      .select('*');
      const medicamentos= m.filter(x => x.nomeProduto.toUpperCase().includes(medicamento.toUpperCase()))
      console.log(medicamentos)
      
      resp.render('Site/produto_1', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
      const m= await knex('produto')
      .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
      .where('idCategoria',d)
      .select('*');
      const medicamentos= m.filter(x => x.nomeProduto.toUpperCase().includes(medicamento.toUpperCase()))
      resp.render('Site/produto_1', {categoria, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
  }


})


 

export default ClienteController;



