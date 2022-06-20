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
  const idUser=req.session?.user.id;
  const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
  resp.render('Farmaceutico/index', {farmaceutico})
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
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
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
FarmaceuticoController.get('/detalhesFarmaceutico',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idProduto, stockProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto').where('idFarmaceutico', idUser).select('*')

    const compras= await knex('compra')
    .join('produto', 'compra.idProduto', 'produto.idProduto')
    .join('cliente', 'compra.idCliente', 'cliente.idCliente')
    if(farmaceutico){
      resp.render('Farmaceutico/perfilFarmaceutico',{farmaceutico,medicamentos, certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
FarmaceuticoController.get('/editarFarmaceutico',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idFarmaceutico}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const Farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    if(farmaceutico){
      // console.log(categoria)
      resp.render('Farmaceutico/editarFarmaceutico',{farmaceutico,Farmaceutico,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
FarmaceuticoController.post('/editarFarmaceutico', async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idFarmaceutico, nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico, enderecoFarmaceutico}=req.body;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const med= await knex('Farmaceutico').where('idFarmaceutico', idFarmaceutico).first();

    console.log({idFarmaceutico, nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico, enderecoFarmaceutico});
    
    const imgFarmaceutico= (req.file)?req.file.filename : med.imgFarmaceutico;
    const categoria= await knex('categoria').select('*')
    let re = /[A-Z]/;
    const hasUpper = re.test(userFarmaceutico);
    const verificaEspaco = /\s/g.test(userFarmaceutico);
    const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailFarmaceutico);
    const number = /^[9]{1}[0-9]{8}$/.test(tellFarmaceutico)
    if (hasUpper === true) {
    req.flash('errado', "Ocorreu um problema");
    resp.redirect('/detalhesFarmaceutico')
 
   } else if (verificaEspaco === true) {
      req.flash('errado', "Ocorreu um Problema");
      resp.redirect('/detalhesFarmaceutico')
   }else{
      const medicamentos= await knex('farmaceutico').where('idFarmaceutico', idFarmaceutico)
      .update({nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico, enderecoFarmaceutico})
      console.log(medicamentos);
      
      if(medicamentos){
        req.flash('certo', 'Dados do Farmaceutico Editado')
        resp.redirect('/detalhesFarmaceutico')
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




//Adicionar Estoque
FarmaceuticoController.get('/estoque_/:idProduto',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .where('produto.idProduto', idProduto).first()
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/adicionarEstoque',{farmaceutico,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
FarmaceuticoController.post('/adicionarEstoque',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idProduto, stockProduto}=req.body
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto')
    .where('produto.idProduto', idProduto).first();
  
    const final=parseInt(stockProduto)+parseInt(medicamentos.stockProduto)
    if(medicamentos){
      // console.log(categoria)
      const medicamentos= await knex('produto')
    .where('produto.idProduto', idProduto).update({stockProduto:final})
      req.flash('certo', 'Stock Adicionado com Sucesso')
      resp.redirect('/estoque')
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
FarmaceuticoController.get('/estoque',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/estoque',{farmaceutico,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
//FIM Estoquue


//Medicamentos Crud Completo
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
FarmaceuticoController.get('/editarMedicamento/:idProduto',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();

    const categoria= await knex('categoria').select('*')
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .where('produto.idProduto', idProduto).first()
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/editarProduto',{farmaceutico,categoria,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
FarmaceuticoController.post('/editarProduto_',upload.single('image'),farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idProduto, nomeProduto, descProduto, precoProduto, estadoProduto, idCategoria}=req.body;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const estado=(estadoProduto=="on")?1:0;
    const med= await knex('produto').where('idProduto', idProduto).first();
    const imgProduto= (req.file)?req.file.filename : med.imgProduto;
    const categoria= await knex('categoria').select('*')
    const medicamentos= await knex('produto').where('idProduto', idProduto).update({idProduto, nomeProduto, descProduto, precoProduto, estadoProduto:estado, idCategoria})
    if(medicamentos){
      // console.log(categoria)
      req.flash('certo', 'Dados do Produto Editado')
      resp.redirect('/listarMedicamentos')
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
FarmaceuticoController.get('/removerMedicamento/:idProduto',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();

    const categoria= await knex('categoria').select('*');
    const compras = await knex('compra').where('idProduto', idProduto).del();
    const medicamentos= await knex('produto').where('idProduto', idProduto).del();
    if(medicamentos){
      // console.log(categoria)
      req.flash('certo', 'Produto Eliminado')
      resp.redirect('/listarMedicamentos')
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)
FarmaceuticoController.get('/detalhesMed/:idProduto',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idProduto, stockProduto}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto')
    .where('produto.idProduto', idProduto)
    .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .join('farmaceutico', 'produto.idFarmaceutico', 'farmaceutico.idFarmaceutico')
    .first();

    const compras= await knex('compra')
    .join('produto', 'compra.idProduto', 'produto.idProduto')
    .join('cliente', 'compra.idCliente', 'cliente.idCliente')
    if(medicamentos){
      resp.render('Farmaceutico/detalhesMed',{farmaceutico,compras, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
FarmaceuticoController.get('/listarMedicamentos',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const medicamentos= await knex('produto').join('categoria', 'produto.idCategoria', 'categoria.idCategoria').select('*')
    if(medicamentos){
      // console.log(categoria)
      resp.render('Farmaceutico/listarProduto',{farmaceutico,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
//Crud Completo









export default FarmaceuticoController;

//image, name, email, whatsaap, nomeuser senha

