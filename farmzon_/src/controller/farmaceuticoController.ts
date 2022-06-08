import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
import farmAuth from '../middlewre/farm'


// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const FarmaceuticoController=Router();
//Papel do Admin
  FarmaceuticoController.post('/NovoFarmaceutico',upload.single('image'),async (req:Request, resp: Response)=>{
      try {
        const imagemFarmaceutico= (req.file) ? req.file.filename : 'user.png';       
        const {nomeFarmaceutico, userFarmaceutico, emailFarmaceutico, tellFarmaceutico,senhaFarmaceutico2, senhaFarmaceutico,generoFarmaceutico,descFarmaceutico}= req.body;         
        if(nomeFarmaceutico=='' || userFarmaceutico=='' || emailFarmaceutico=='' || tellFarmaceutico=='' || senhaFarmaceutico==''|| generoFarmaceutico==''){
          req.flash('errado', 'Valores incorretos');
          console.log('mmm')
        }else{
          let re = /[A-Z]/;
          const hasUpper = re.test(userFarmaceutico);
          const verificaEspaco = /\s/g.test(userFarmaceutico);
          const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailFarmaceutico);
          const number = /^[9]{1}[0-9]{8}$/.test(tellFarmaceutico)
          if (hasUpper === true) {
            req.flash('errado', "Ocorreu um problema");
          console.log('mmm')
       
   
         } else if (verificaEspaco === true) {
            req.flash('errado', "nao cadastrado 2");
          console.log('mmm')
   
         } else
            if (!Mailer) {
               req.flash('errado', "nao cadastrado 3");
             console.log('mmm')
            } else
               if (senhaFarmaceutico.length < 5) {
                  req.flash('errado', "Senha muito fraca");
                console.log('mmm')
               } else
                  if (senhaFarmaceutico != senhaFarmaceutico2) {
                     req.flash('errado', "Senha Diferentes");
                   console.log('mmm')
   
                  } else if(number == false) {
                     req.flash('errado', "Numero de Telefone incorreto");
                   console.log('mmm')
      
                  }else{ 
          const farmac= await knex('farmaceutico').where('userFarmaceutico',userFarmaceutico).orWhere('tellFarmaceutico',tellFarmaceutico).orWhere('senhaFarmaceutico',emailFarmaceutico)
          if(farmac.length>0){
            
            req.flash('errado', 'Esses dados Ja encontra-se presente ');
            console.log('mmm')
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
        console.log('mmm')
      }else{
        let re = /[A-Z]/;
        const hasUpper = re.test(userFarmaceutico);
        const verificaEspaco = /\s/g.test(userFarmaceutico);
        const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailFarmaceutico);
        const number = /^[9]{1}[0-9]{8}$/.test(tellFarmaceutico)
        if (hasUpper === true) {
          req.flash('errado', "Ocorreu um problema");
        console.log('mmm')
     
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
        console.log('mmm')
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
           console.log('mmm')
          } else
            if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                 console.log('mmm')
    
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
       
export default FarmaceuticoController;

//image, name, email, whatsaap, nomeuser senha

