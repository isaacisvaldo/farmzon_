import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import clienteAuth from '../middlewre/cliente'

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
          console.log('Error1')
        // resp.redirect("/cadastrarCliente")
 
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          console.log('Error2')
        
        // resp.redirect("/cadastrarCliente")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             console.log('Error3')
        // resp.redirect("/cadastrarCliente")
          } else
             if (senhaCliente.length < 5) {
                req.flash('errado', "Senha muito fraca");
                console.log('Error23')
        // resp.redirect("/cadastrarCliente")
             } else
                if (senhaCliente != senhaCliente2) {
                   req.flash('errado', "Senha Diferentes");
                   console.log('Error2')
        // resp.redirect("/cadastrarCliente")
 
                } else if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   console.log('Error2')
        // resp.redirect("/cadastrarCliente")
    
                }else{ 
                  const verify= await knex('cliente').where('emailCliente', emailCliente).orWhere('userCliente', userCliente)
                  if(verify.length===0){
                    const ids = await knex('cliente').insert({imgCliente, nomeCliente, userCliente, emailCliente,tellCliente,senhaCliente,estadoCliente,generoCliente,role}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("/cadastrarCliente")})
                   
                  
                    req.flash("certo","Criado com sucesso !")
                    resp.json("Cadastrou")
                   // resp.redirect("/loginGeral")
                  }else{
                    req.flash("info","Este usuario ja esta cadastrado!")
                    resp.json("Nao cadastrou")
                    //resp.redirect("/cadastrarCliente")
                  
                   }
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   console.log('Error2')
        // resp.redirect("/cadastrarCliente")

 }
                   
})
//Cliente Autenticado
ClienteController.get("/Clientelogado", async(req:Request, resp:Response) =>{
  const id=req.session?.user.id;
  const cliente= await knex('cliente').where('idCliente', id).first();
  if(cliente){
    console.log(cliente)
    resp.render('Cliente/index',{cliente,certo:req.flash('certo'),errado:req.flash('errado')})
  }else{
    resp.redirect("/404")
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
          console.log('Error1')
        // resp.redirect("/cadastrarCliente")
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          console.log('Error2')
        // resp.redirect("/cadastrarCliente")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             console.log('Error3')
        // resp.redirect("/cadastrarCliente")
          } else
              if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   console.log('Error2')
        // resp.redirect("/cadastrarCliente")
    
                }else{ 
                  const ids = await knex('cliente').where('idCliente',id).update({nomeCliente, userCliente, emailCliente,tellCliente,generoCliente,}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");})
                  resp.json('Atualizou...')
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   console.log('Error2')
        // resp.redirect("/cadastrarCliente")

 }
                   
})

  //Fim Cliente autenticado
  
 

  //Cliente Não autenticado

 

export default ClienteController;



