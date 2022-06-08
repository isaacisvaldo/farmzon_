//import jwt  from 'jsonwebtoken';
import knex from '../database/conection';


async function authenticate(user:string, pass:string) {
    try {
       
        const pDados =await knex('cliente').where('userCliente', user).where('senhaCliente', pass)
        if(pDados.length!==0){
            const pc = pDados[0]
            return {pc, p:'cliente'}
        }else if(pDados.length===0){
            const admin= await knex('farmaceutico').where('userFarmaceutico', user).where('senhaFarmaceutico',pass)
            if(admin.length!==0){
                const farm= admin[0];
                const Farm= {farm, p:'farm'}
                return Farm
            }else{ 
                return '-1'  
            }
        }else{
            return '-1'
        }
    } catch (error) {
        console.log(error)
    }

}

export {authenticate};
