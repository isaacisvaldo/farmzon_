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

CategoriaController.get("/listarCategoria",farmAuth, async(req:Request, resp:Response) =>{
  try {
      const idUser=req.session?.user.id;
      const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser)
      const categoria= await knex('categoria').select('*')
      const produto= await knex('produto').groupBy('idCategoria').count('idCategoria', {as:'quantidade'}).select('*');
      if(categoria){
        // console.log(categoria)
        resp.render('Farmaceutico/listaCategoria',{farmaceutico,categoria,produto,certo:req.flash('certo'),errado:req.flash('errado')})
      }else{
        resp.redirect("/404")
    }    
  } catch (error) {
    console.log(error);
    resp.render("error/page-404")
  }

})

CategoriaController.get('/detalhesCat/:idCategoria',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    let {idCategoria}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first()
    const categoria= await knex('categoria')
    .where('idCategoria', idCategoria).first();

    const medicamentos= await knex('produto').where('idCategoria', idCategoria)
    if(categoria){
      resp.render('Farmaceutico/detalhesCat',{farmaceutico,categoria,medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
})
CategoriaController.post('/editarCategoria_',upload.single('image'),farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {nomeCategoria, desCategoria, idCategoria}=req.body;
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();
    const med= await knex('categoria').where('idCategoria', idCategoria).first();
    const imagemCategoria= (req.file)?req.file.filename : med.imagemCategoria;
    const categoria= await knex('categoria').select('*')
    const medicamentos= await knex('categoria').where('idCategoria', idCategoria).update({nomeCategoria, imagemCategoria,desCategoria })
    if(medicamentos){
      // console.log(categoria)
      req.flash('certo', 'Dados da Categoria Editado')
      resp.redirect('/detalhesCat/'+med.idCategoria)
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)

CategoriaController.get('/removerCategoria/:idCategoria',farmAuth, async (req:Request, resp: Response)=>{
  try {
    const idUser=req.session?.user.id;
    const {idCategoria}=req.params
    const farmaceutico= await knex('farmaceutico').where('idFarmaceutico', idUser).first();

    const categoria= await knex('categoria').select('*');
    const compras = await knex('produto').where('idCategoria', idCategoria).del();
    const medicamentos= await knex('categoria').where('idCategoria', idCategoria).del();
    if(medicamentos){
      // console.log(categoria)
      req.flash('certo', 'Categoria Eliminada')
      resp.redirect('/listarCategoria')
    }else{
      resp.render("error/page-404")
  }    
} catch (error) {
  console.log(error);
  resp.render("error/page-404")
}
}
)



 

export default CategoriaController;



