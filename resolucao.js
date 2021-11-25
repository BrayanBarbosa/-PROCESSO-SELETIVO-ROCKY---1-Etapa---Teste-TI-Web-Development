const fs = require ('fs');

//função para escrever arquivo json

const JSONWrite = (filepath, data, encoding = 'utf-8')=>{
    const promiseCallBack = (resolve, reject)=>{
        fs.writeFile(filepath,JSON.stringify(data, null, 2), encoding, (err)=>{
            if (err){ return reject(err);
            return;
        }
        resolve(true);
        });
    };
    return new Promise(promiseCallBack);
};


//função de leitura

const JSONRead = (filepath, encoding = 'utf-8')=>{
    const promiseCallBack = (resolve, reject)=>{
        fs.readFile(filepath, encoding, (err, data)=>{
            if (err){ return reject(err);
            return;
        }
        try{
            const object = JSON.parse(data);
            resolve(object)
        }catch(e){
            reject(e);
        }

        });
    };
    return new Promise(promiseCallBack);
};

//função de Update, corrige todos os objetos corrompidos dentro do arquivo broken-database.

const JSONUpdate = (filepath, enconding ='utf-8')=>{
    const promiseCallBack = async (resolve, reject)=>{
        try{
        const data = await JSONRead(filepath, enconding);
        console.log('Corrigindo os caracteres corrompidos, convertendo o campo Price de string para Number e inserindo o campo quantity com o valor 0 caso ele não exista: ')
            for(element of data){
                //percorre a lista subistituindo os valores corrompidos por caracteres validos
                element.name = element.name.replaceAll('ø','o').replaceAll('æ','a').replaceAll('¢','c').replaceAll('ß','b');
                //percorre a lista convertendo os valores do campo price de valores do tipo string para o tipo float/number
                element.price = parseFloat(element.price);
                //percorre a lista acrescentando o campo quantity com valor 0 caso ele não exista.
                if(!element.quantity)
                   element.quantity = 0;
            }
        JSONWrite(filepath, data, enconding);
        resolve (data)
        }catch(e){
            reject(e);
        }
    }
    
    return new Promise(promiseCallBack);
}
//função que retorna a lista ordenada por categoria em ordem alfabética .
const JSONOrdenarCategory = (filepath, enconding ='utf-8')=>{
    const promiseCallBack = async (resolve, reject)=>{
        try{
        const data = await JSONRead(filepath, enconding);
        console.log('Ordenando por categoria: ')
            for(element of data){
                //percorre a lista e em seguida ordena os itens do campo category por ordem alfabética.
                    data.sort(function(a, b){
                    if (a.category >= b.category)
                      return 1;
                    if (a.category < b.category)
                      return -1;
                  });
                  console.log(element.name);    
            }
        JSONWrite(filepath, data, enconding);
        resolve (data)
        }catch(e){
            reject(e);
        }
    }
    
    return new Promise(promiseCallBack);
}
//função que retorna a lista ordenada por id em ordem crescente
const JSONOrdenarId = (filepath, enconding ='utf-8')=>{
    const promiseCallBack = async (resolve, reject)=>{
        try{
        const data = await JSONRead(filepath, enconding);
        console.log('Ordenando por id: ')
            for(element of data){
                //percorre a lista em seguida ordena os itens do campo ID por ordem numérica crescente .
                  data.sort(function(a, b){
                    if (a.id >= b.id)
                      return 1;
                    if (a.id < b.id)
                      return -1;
                  });console.log(element.id + ' - ' +element.name)
            }
        JSONWrite(filepath, data, enconding);
        resolve (data)
        }catch(e){
            reject(e);
        }
    }
    
    return new Promise(promiseCallBack);
}
//Função que calcula o valor total em estoque de cada item em cada categoria.
const JSONCalcula = (filepath, enconding ='utf-8')=>{
    const promiseCallBack = async (resolve, reject)=>{
        try{
        const data = await JSONRead(filepath, enconding); 
            var cleaned = [];
            //Prcorre a lista agrupando os grupos de nomes iguais, somando e mutiplicando os preços
            // através das quantidades exibidas em estoque em seguida mostra o valor total do estoque.
            data.forEach(function(itm) {
                var unique = true;
                itm.price = itm.price * itm.quantity
                cleaned.forEach(function(itm2) {
                    if (itm.category === itm2.category) {

                    itm2.price = itm.price + itm2.price;
                    unique = false;
                    }
                });
                if (unique) {
                  cleaned.push(itm);
                  }
            });
            var total = 0;
            cleaned.forEach(e =>{
                total = total + e.price;
                console.log(e.category + ' ' + e.price.toFixed(2))
            })
           console.log('Total: ' + total.toFixed(2));
        }catch(e){
            reject(e);
        }
    }
    
    return new Promise(promiseCallBack);
}

//Para efetuar modificações ou sobrescrever o arquivo broken-database.json utilize a chamada abaixo:
JSONWrite('./broken-database.json').then(console.log).catch(console.error);
//Para ler um arquivo .JSON utilize a chamada abaixo:
JSONRead ('./broken-database.json').then(console.log).catch(console.error);
//Para efetuar as modificações exigidas pelo enunciado utilize a chamada abaixo:
JSONUpdate('./broken-database.json').then(console.log).catch(console.error);
//Para ordenar os itens por ID, utilize a chamada abaixo:
JSONOrdenarId('./broken-database.json');
//Para odenar os itens por categoria, utilize a chamada abaixo:
JSONOrdenarCategory('./broken-database.json');
//Para efetuar os calculos e agrupamentos exigidos pelo enunciado execute a chamada abaixo:
JSONCalcula('./broken-database.json');
