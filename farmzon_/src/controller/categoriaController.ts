import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';

import farmAuth from '../middlewre/farm'

import { Response, Request, Router, request } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
const CategoriaController=Router();

import { date } from '@hapi/joi';
// import bCryptjs from 'bcryptjs
CategoriaController.post('/Novocategoria',async(req:Request, resp: Response)=>{

  const {nomecategoria, usercategoria, emailcategoria,tellcategoria,senhacategoria,senhacategoria2,generocategoria}=req.body; 
 const estadocategoria = 1;
 const role= 2;
 if(!(nomecategoria===''|| usercategoria===''|| emailcategoria===''||tellcategoria===''||senhacategoria===''||senhacategoria2===''||generocategoria==='')){
  const imgcategoria= (req.file) ? req.file.filename : 'user.png';
  let re = /[A-Z]/;
  const hasUpper = re.test(usercategoria);
  const verificaEspaco = /\s/g.test(usercategoria);
  const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailcategoria);
  const number = /^[9]{1}[0-9]{8}$/.test(tellcategoria)
 if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
 
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastarcategoria')
        
        // resp.redirect("/cadastrarcategoria")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
          } else
             if (senhacategoria.length < 5) {
                req.flash('errado', "Senha muito fraca");
                resp.redirect('/cadastarcategoria3')
        // resp.redirect("/cadastrarcategoria")
             } else
                if (senhacategoria != senhacategoria2) {
                   req.flash('errado', "Senha Diferentes");
                   resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
 
                } else if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
    
                }else{ 
                  const verify= await knex('categoria').where('emailcategoria', emailcategoria).orWhere('usercategoria', usercategoria)
                  if(verify.length===0){
                    const ids = await knex('categoria').insert({imgcategoria, nomecategoria, usercategoria, emailcategoria,tellcategoria,senhacategoria,estadocategoria,generocategoria,role}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("/cadastrarcategoria")})
                   
                  
                    req.flash("certo","Criado com sucesso !")
                    resp.redirect("/loginGeral")
                   // resp.redirect("/loginGeral")
                  }else{
                    req.flash("errado","Este usuario ja esta cadastrado!")
                    resp.json("/cadastarcategoria")
                    //resp.redirect("/cadastrarcategoria")
                  
                   }
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")

 }
                   
})
//categoria Autenticado
CategoriaController.get("/categorialogado", async(req:Request, resp:Response) =>{
  const id=req.session?.user.id;
  const categoria= await knex('categoria').where('idcategoria', id).first();
  if(categoria){
    console.log(categoria)
    resp.render('categoria/index',{categoria,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
    resp.redirect("/404")
  }
})
CategoriaController.post('/Atualizarcategoria',async(req:Request, resp: Response)=>{

  const {nomecategoria,id, usercategoria, emailcategoria,tellcategoria,generocategoria}=req.body; 

 if(!(nomecategoria===''|| usercategoria===''|| emailcategoria===''||tellcategoria===''||generocategoria==='')){
  let re = /[A-Z]/;
  const hasUpper = re.test(usercategoria);
  const verificaEspaco = /\s/g.test(usercategoria);
  const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailcategoria);
  const number = /^[9]{1}[0-9]{8}$/.test(tellcategoria)
 if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
          } else
              if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")
    
                }else{ 
                  const ids = await knex('categoria').where('idcategoria',id).update({nomecategoria, usercategoria, emailcategoria,tellcategoria,generocategoria,}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");})
                  resp.json('Atualizou...')
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/cadastarcategoria')
        // resp.redirect("/cadastrarcategoria")

 }
                   
})

CategoriaController.get("/listarCategoria",farmAuth, async(req:Request, resp:Response) =>{
  try {
      const idUser=req.session?.user.id;
      const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser)
      const categoria= await knex('categoria').select('*')
      if(categoria){
        // console.log(categoria)
        resp.render('Farmaceutico/listaCategoria',{farmaceutico,categoria,certo:req.flash('certo'),errado:req.flash('errado')})
      }else{
        resp.redirect("/404")
    }    
  } catch (error) {
    console.log(error);
    resp.render("error/page-404")
  }

})

  //Fim categoria autenticado
  
 

  //categoria Não autenticado

 

export default CategoriaController;



