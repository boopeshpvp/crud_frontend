const express=require('express')
const app=express()
const port=4000
const authRoute=require('./routes/authroute')
const userRoute=require('./routes/userroute')
const cors=require('cors')
require('dotenv').config()

app.use(express.json())

app.use(cors())
        
app.use('/auth',authRoute)
app.use('/user',userRoute)

app.get('/',async(req,res)=>{
    res.send('welcome')
})

app.listen(port,()=>{
    console.log('server is running');
    
})