//import jwt  from 'jsonwebtoken';
import knex from '../database/conection';


async function authenticate(user:string, pass:string) {
    try {
       
        const pDados =await knex('paciente').where('userPaciente', user).where('senhaPaciente', pass)
        if(pDados.length!==0){
            const pc = pDados[0]
            return {pc, p:'paciente'}
        }else if(pDados.length===0){
            const admin= await knex('medico').where('userMedico', user).where('passMedico',pass)
            if(admin.length!==0){
                const admn= admin[0];
                if (admn.role==1) {
                    const ADMINadmn = {admn, p:'admin'}
                    return ADMINadmn
                }else{
                    const ADMINadmn = {admn, p:'medico_normal'}
                    return ADMINadmn  
                }
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
