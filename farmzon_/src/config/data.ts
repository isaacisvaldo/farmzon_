var data = new Date();
var dia = String(data.getDate()).padStart(2,'0')
var mes = String(data.getMonth() + 1).padStart(2,'0')
var ano = String(data.getFullYear()).padStart(2,'0')

var dataAtual = ano +'-'+mes+'-'+ dia
var dias =10

function addDias(data:any, dias:any) {
    var res = new Date(data);
    res.setDate(res.getDate() + 1 + dias);
    return res
}
var tmpDate = new Date(dataAtual)
var t =(addDias(tmpDate, dias));
var b= t.toISOString();
var inicio = b.split("T")

var c = (inicio[0]);

console.log(c)
data = new Date(c);
    
var day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
var date = data.getDate();
var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
var year = data.getFullYear();



console.log(day,month,year)

if(day=="Sábado"){
    t =(addDias(tmpDate, 12))
    var b= t.toISOString();
var inicio = b.split("T")

 c = (inicio[0]);
 data = new Date(c);
    
day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
    

}else if(day=="Domingo"){
    t =(addDias(tmpDate, 11))
    var b= t.toISOString();
    var inicio = b.split("T")

     c = (inicio[0]);
     data = new Date(c);    
     day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
         
     
    
}

export {addDias, c,day,dataAtual}




