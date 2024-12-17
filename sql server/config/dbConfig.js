const mysql=require('mysql')

const dbConnection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'2023',
    database:'practice'
})

dbConnection.connect((err)=>{
       if(err){
        console.log('connection fail');      
       }
       else{
        console.log('connection success');    
       }
})

module.exports=dbConnection