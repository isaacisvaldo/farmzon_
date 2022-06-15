import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
import farmAuth from '../middlewre/farm'


// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const FarmaceuticoController=Router();
//Papel do Admin

FarmaceuticoController.get('/Farmaceutico',farmAuth,async(req:Request, resp: Response)=>{
  resp.render('Farmaceutico/index')
})
  FarmaceuticoController.post('/NovoFarmaceutico',upload.single('image'),async (req:Request, resp: Response)=>{
      try {
        const imagemFarmaceutico= (req.file) ? req.file.filename : 'user.png';       
        const {nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico,senhaFarmaceutico2, senhaFarmaceutico,generoFarmaceutico,descFarmaceutico}= req.body;         
        if(nomeFarmaceutico=='' || userFarmaceutico=='' || emailFarmaceutico=='' || tellFarmaceutico=='' || senhaFarmaceutico==''|| generoFarmaceutico==''){
          req.flash('errado', 'Valores incorretos');
          resp.redirect('/cadastrarMedicamentos')
        }else{
          let re = /[A-Z]/;
          const hasUpper = re.test(userFarmaceutico);
          const verificaEspaco = /\s/g.test(userFarmaceutico);
          const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailFarmaceutico);
          const number = /^[9]{1}[0-9]{8}$/.test(tellFarmaceutico)
          if (hasUpper === true) {
            req.flash('errado', "Ocorreu um problema");
          resp.redirect('/cadastrarMedicamentos')
       
   
         } else if (verificaEspaco === true) {
            req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastrarMedicamentos')
   
         } else
            if (!Mailer) {
               req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastrarMedicamentos')
            } else
               if (senhaFarmaceutico.length < 5) {
                  req.flash('errado', "Senha muito fraca");
                resp.redirect('/cadastrarMedicamentos')
               } else
                  if (senhaFarmaceutico != senhaFarmaceutico2) {
                     req.flash('errado', "Senha Diferentes");
                   resp.redirect('/cadastrarMedicamentos')
   
                  } else if(number == false) {
                     req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/cadastrarMedicamentos')
      
                  }else{ 
          const farmac= await knex('farmaceutico').where('userFarmaceutico',userFarmaceutico).orWhere('tellFarmaceutico',tellFarmaceutico).orWhere('senhaFarmaceutico',emailFarmaceutico)
          if(farmac.length>0){
            
            req.flash('errado', 'Esses dados Ja encontra-se presente ');
            resp.redirect('/cadastrarMedicamentos')
          }else{
            const farmac= await knex('farmaceutico').insert({role:1, nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico, senhaFarmaceutico,generoFarmaceutico,imagemFarmaceutico, descFarmaceutico})
            req.flash('certo', 'Farmaceutico Cadastrato com Sucesso');
            resp.redirect('/listarFarmaceutico')
           
          }
        }
      }
       
      } catch (error) {
        resp.send(error + " - falha ao registar")
      }
    }    
)
  FarmaceuticoController.post('/AtualizarFarmaceutico',async (req:Request, resp: Response)=>{
    try {
          
      const {nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico,generoFarmaceutico,idFarmaceutico,descFarmaceutico}= req.body;         
      if(nomeFarmaceutico=='' || userFarmaceutico=='' || emailFarmaceutico=='' || tellFarmaceutico=='' || generoFarmaceutico==''){
        req.flash('errado', 'Valores incorretos');
        resp.redirect('/cadastrarMedicamentos')
      }else{
        let re = /[A-Z]/;
        const hasUpper = re.test(userFarmaceutico);
        const verificaEspaco = /\s/g.test(userFarmaceutico);
        const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailFarmaceutico);
        const number = /^[9]{1}[0-9]{8}$/.test(tellFarmaceutico)
        if (hasUpper === true) {
          req.flash('errado', "Ocorreu um problema");
        resp.redirect('/cadastrarMedicamentos')
     
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
        resp.redirect('/cadastrarMedicamentos')
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
           resp.redirect('/cadastrarMedicamentos')
          } else
            if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                 resp.redirect('/cadastrarMedicamentos')
    
                }else{ 
     
          const farmac= await knex('farmaceutico').where('idFarmaceutico',idFarmaceutico).update({nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico,generoFarmaceutico, descFarmaceutico})
          req.flash('certo', 'Farmaceutico Cadastrato com Sucesso');
          resp.redirect('/listarFarmaceutico')
         
        
      }
    }
     
    } catch (error) {
      resp.send(error + " - falha ao registar")
    }
  }    
)
  FarmaceuticoController.post('/Novacategoria',async(req:Request, resp: Response)=>{
    const {nomeCategoria,desCategoria}= req.body;
  if(nomeCategoria===''|| desCategoria===''){

  }else{
    const verify = await knex('categoria').where('emailCliente', nomeCategoria)
    if(verify.length===0){
      const ids = await knex('categoria').insert({nomeCategoria,desCategoria}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("")})
    }else{
      resp.send('Essa categoria ja existe')
    }
  }
})
FarmaceuticoController.post('/Atualizarcategoria',async(req:Request, resp: Response)=>{
      const {nomeCategoria,desCategoria,idCategoria}= req.body;
    if(nomeCategoria===''|| desCategoria===''){
  
    }else{
     
       const ids = await knex('categoria').where('idCategoria',idCategoria).update({nomeCategoria,desCategoria}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("")})
        
    }
 })
 FarmaceuticoController.get('/cadastrarMedicamentos',farmAuth, async(req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const categoria= await knex('categoria').select('*')
    if(categoria){
      // console.log(categoria)
      resp.render('Farmaceutico/cadastrarMedicamento',{farmaceutico,categoria,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.redirect("/404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})

FarmaceuticoController.post('/NovoProduto',upload.single('image'), async (req:Request, resp: Response)=>{
        
          let imgProduto=''; 
          if(req.file) {
            imgProduto=req.file.filename;
            const {nomeProduto, descProduto, stockProduto,precoProduto, idCategoria, idFarmaceutico}= req.body; 
            const estadoProduto=1;        
            if(nomeProduto=='' || descProduto==''){
              req.flash('errado', 'Valores incorretos');
              resp.redirect('/cadastrarMedicamentos')
            }else{
              let number = /[0-9]/.test(precoProduto);
             
            if(number == false) {
                     req.flash('errado', "Preço incorreto");
                       resp.redirect('/cadastrarMedicamentos')
          
                      }else{ 
            const verify = await knex('produto').where('nomeProduto',nomeProduto)
            if(verify.length===0){
             const produto = await knex('produto').insert({nomeProduto,imgProduto,idFarmaceutico, descProduto, stockProduto,precoProduto,estadoProduto,idCategoria})
             req.flash('certo','Produto cadastrado')
             resp.redirect('/listarMedicamentos')
            }else{
              req.flash('errado','Esse produto ja existe')
              resp.redirect('/cadastrarMedicamentos')
            }
            }
           
          }
          } else if(!req.file){
            req.flash('errado', 'Adicione uma Imagem');
            resp.redirect('/cadastrarMedicamentos')
          }   

     
})
FarmaceuticoController.post('/AtualizarProduto',async (req:Request, resp: Response)=>{
  try {
        
    const {nomeProduto, descProduto,idProduto,stockProduto,precoProduto,estadoProduto, idCategoria}= req.body;         
    if(nomeProduto=='' || descProduto==''){
      req.flash('errado', 'Valores incorretos');
      resp.redirect('/cadastrarMedicamentos')
    }else{
      let number = /[0-9]/.test(precoProduto);
     
    if(number == false) {
             req.flash('errado', "Preço incorreto");
               resp.redirect('/cadastrarMedicamentos')
  
              }else{ 

         const produto = await knex('produto').where('idProduto',idProduto).update({nomeProduto, descProduto, stockProduto,precoProduto,estadoProduto,idCategoria})

   
            }
   
  }
}catch (error) {
  resp.send(error + " - falha ao registar")
}  
})
FarmaceuticoController.get('/listarMedicamentos',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser)
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/listarProduto',{farmaceutico,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.redirect("/404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
FarmaceuticoController.get('/estoque',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser)
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/estoque',{farmaceutico,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.redirect("/404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})

//cliente---------------------------------------------------------------------
FarmaceuticoController.get('/Clientes',farmAuth,async(req:Request, resp: Response)=>{
  const clientes = await knex('cliente').select('*');
  resp.render('DashBoard/clientes',{clientes})
})
FarmaceuticoController.get('/Cliente/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const clientes = await knex('cliente').where('idCliente',id).select('*')
  if(clientes){
   
  }else{
resp.redirect("/404")
  }
})
FarmaceuticoController.get('/Clientedeletar/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const cliente = await knex('cliente').where('idCliente',id).delete()
 resp.send('Deletado...')
 
})
//produtos-------------------------------------------------------------------
FarmaceuticoController.get('/Produtos',farmAuth,async(req:Request, resp: Response)=>{
  const produtos = await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*');
  console.log(produtos)
  resp.render('DashBoard/produtos',{produtos})
})
FarmaceuticoController.get('/Produto/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const produto = await knex('produto').where('idProduto',id).join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
  if(produto){
   
  }else{
resp.redirect("/404")
  }
})
FarmaceuticoController.get('/produtodeletar/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const produto= await knex('produto').where('idProduto',id).delete()
   resp.send('Deletado...')
 
})
//Categoria-------------------------------------------------------------------
FarmaceuticoController.get('/Categoria',farmAuth,async(req:Request, resp: Response)=>{
  const categorias = await knex('categoria').select('*');
  console.log(categorias)
  resp.render('DashBoard/categoria',{categorias})
})
FarmaceuticoController.get('/Produto/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const produto = await knex('produto').where('idProduto',id).join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
  if(produto){
   
  }else{
resp.redirect("/404")
  }
})
FarmaceuticoController.get('/produtodeletar/:id',farmAuth,async(req:Request, resp: Response)=>{
  const {id}=req.params;
  const produto= await knex('produto').where('idProduto',id).delete()
   resp.send('Deletado...')
 
})


export default FarmaceuticoController;

//image, name, email, whatsaap, nomeuser senha

