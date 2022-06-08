import { Response, Request, NextFunction } from "express";
const pacienteAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session?.user){
        if(req.session.user.role==2){
            next();
        }else{
            resp.redirect('/login')
        }
    }else{
        resp.redirect('/loginGeral')
    }
}

export default  pacienteAuth;