import {Router, Request, Response} from 'express';
const Route= Router (); 
import knex from './database/conection';
import MarcacaoController from './controller/compraController';
import PacienteController from './controller/clienteController';
import { authenticate } from './config/loginService';
import MedicoController from './controller/farmaceuticoController';
import CategoriaController from './controller/categoriaController';
import ClienteController from './controller/clienteController';
import multerConfig from './config/multer';
import multer from 'multer';
const upload = multer(multerConfig);


//Middlewares
import pacienteAuth from './middlewre/cliente' //cliente
import adminAuth from './middlewre/farm'

//Rotas de erro
Route.get('/404', (req:Request, resp: Response)=>{
    resp.render('error/page-404')
})

Route.get('/503', (req:Request, resp: Response)=>{
    resp.render('error/page-503')
})

Route.get('/loginGeral', (req:Request, resp: Response)=>{
    resp.render('Site/login',{errado:req.flash('errado'), certo:req.flash('certo')})
})
Route.get('/cadastarCliente', (req:Request, resp: Response)=>{
    resp.render('Site/cadastrar',{errado:req.flash('errado'), certo:req.flash('certo')})
})

// Home page do Sistema
Route.get('/',async (req:Request, resp: Response)=>{
    const categoria= await knex('categoria').select('*');

    const medicamentos= await knex('produto')
    .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .select('*');

    const comprasEfectuada=await knex('compra').select('*')
    
    const medicamentos3= await knex('produto').limit(3)
    .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .select('*');
    const medicamentos3desc= await knex('produto').orderBy('idProduto','desc').limit(3)
    .join('categoria', 'produto.idCategoria', 'categoria.idCategoria')
    .select('*');

    const comprasTotal=await  knex('compra').sum('debitoCompra', {as:'TransacaoTotal'}).select('idProduto')
   console.log(comprasTotal);
   
 resp.render('Site/index', {categoria, comprasTotal,medicamentos3,comprasEfectuada,medicamentos3desc, medicamentos,certo:req.flash('certo'),errado:req.flash('errado')})


})





Route.get('/logout', (req:Request, resp: Response)=>{
    req.session = undefined;
    resp.redirect('/')
})

//LOGIN GERAL DO SISTEMA
Route.post('/loginGeral',async (req:Request, resp: Response)=>{ 
    try {
        const {user, pass}= req.body;
        authenticate(user, pass).then(r=>{
            if(r==='-1'){
                req.flash("errado","Erro ao autenticar!")
                resp.redirect('/loginGeral')
                
            }else{
                const dados=r;
                if(dados){
                     if(dados.p === 'cliente'){ 
                        const pc:any = dados
                        if(req.session){
                          req.session.user={role:2, id:pc.pc.idCliente};
                          resp.redirect('/Clientelogado')
                        }      
                     }else if(dados.p === 'farm'){
                        const adminDados:any = dados
                        if(req.session){
                          req.session.user={role:adminDados.farm.role, id:adminDados.farm.idFarmaceutico};
                          console.log(req.session.user);
                          resp.redirect('/Farmaceutico')
                        } 
                     }else{
                        req.flash("errado","Erro ao autenticar!")
                        resp.redirect('/loginGeral')
                       
                    }
                }
            }
        })   
    } catch (error) {
        console.log(error)
    }
})

export default Route;