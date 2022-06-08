import knex from '../database/conection';
import cron  from 'node-cron'
async function  updateDate(){
 const maracacao = await knex('maracao').where("estadoMarcacao",0).select('*');
 maracacao.map(marc =>{
     if(marc.dataMarcacao > 'data de hoje'){

     }else if(marc.dataMarcacao == 'data de hoje'){
        if (marc.hora > 'hora atual'){
            
   // const marcacao = await knex('marcacao')
        }
     }
 })
 console.log("estou analizar o dia")
    
}

let c = cron.schedule('* * * * *', updateDate,{
scheduled:false
});

export default c;
