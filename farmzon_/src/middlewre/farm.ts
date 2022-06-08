import { Response, Request, NextFunction } from "express";
const adminAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session?.user){      
        if(req.session.user.role==1){
            next();
        }else{
            resp.redirect('/loginGeral')
        }
    }else{
        resp.redirect('/loginGeral')
    }
}


export default adminAuth;