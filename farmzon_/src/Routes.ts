import {Router, Request, Response} from 'express';
const Route= Router (); 
import knex from './database/conection';
import MarcacaoController from './controller/compraController';
import PacienteController from './controller/clienteController';
import { authenticate } from './config/loginService';
import MedicoController from './controller/farmaceuticoController';
import multerConfig from './config/multer';
import multer from 'multer';
const upload = multer(multerConfig);


//Middlewares
import pacienteAuth from './middlewre/cliente' //cliente
import adminAuth from './middlewre/farm'







//Rotas Gerais do Sistema
//Login principal
Route.get('/loginGeral', (req:Request, resp: Response)=>{
    resp.render('',{certo:req.flash('certo'),errado:req.flash('errado')})
})




// Home page do Sistema
Route.get('/',async (req:Request, resp: Response)=>{
 resp.send("Rodando")
})

Route.get('/logout', (req:Request, resp: Response)=>{
    req.session = undefined
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
                     if(dados.p === 'paciente'){ 
                        const pc:any = dados
                        if(req.session){
                          req.session.user={role:2, id:pc.pc.idPaciente};
                          resp.redirect('/pacientePainel')
                        }      
                     }else if(dados.p === 'admin'){
                        const adminDados:any = dados
                        if(req.session){
                          req.session.user={role:adminDados.admn.role, id:adminDados.admn.idMedico};
                          console.log(req.session.user);
                          resp.redirect('/adminPainel')
                        } 
                     }else if(dados.p==='medico_normal'){
                        const medico:any= dados
                        if(req.session){
                            req.session.user={role:medico.admn.role, id:medico.admn.idMedico};
                            resp.redirect('/medicoPainel')
                          
                        } 
                    }
                }
            }
        })   
    } catch (error) {
        console.log(error)
    }
})

export default Route;