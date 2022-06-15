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
CategoriaController.post('/Novocategoria',upload.single('image'), async(req:Request, resp: Response)=>{

  const {nomeCategoria, desCategoria}=req.body; 
  console.log(nomeCategoria, desCategoria);
  
 if(!(nomeCategoria===''|| desCategoria==='')){
  const imagemCategoria= (req.file) ? req.file.filename : 'categoria.jpg';

 if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(nomeCategoria))) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/listarCategoria')
        // resp.redirect("/cadastrarcategoria")
 
 
       }
       else{ 
                  const verify= await knex('categoria').where('nomeCategoria', nomeCategoria).orWhere('desCategoria', desCategoria)
                  if(verify.length===0){
                    const ids = await knex('categoria').insert({imagemCategoria, nomeCategoria, desCategoria}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("/cadastrarcategoria")})
                   
                  
                    req.flash("certo","Criado com sucesso !")
                    resp.redirect('/listarCategoria')
                   // resp.redirect("/loginGeral")
                  }else{
                    req.flash("errado","Este usuario ja esta cadastrado!")
                    resp.json("/listarCategoria")
                    //resp.redirect("/cadastrarcategoria")
                  
                   }
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/listarCategoria')
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
          resp.redirect('/listarCategoria')
        // resp.redirect("/cadastrarcategoria")
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/listarCategoria')
        // resp.redirect("/cadastrarcategoria")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/listarCategoria')
        // resp.redirect("/cadastrarcategoria")
          } else
              if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/listarCategoria')
        // resp.redirect("/cadastrarcategoria")
    
                }else{ 
                  const ids = await knex('categoria').where('idcategoria',id).update({nomecategoria, usercategoria, emailcategoria,tellcategoria,generocategoria,}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");})
                  resp.json('Atualizou...')
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
   resp.redirect('/listarCategoria')
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



