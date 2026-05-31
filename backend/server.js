import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {userApp} from './APIs/UserAPI.js'
import { fileApp } from './APIs/fileAPi.js'

config()
const app = exp()
app.use(cors({origin:process.env.FRONTEND_URL , credentials:true}))

// DB connection and port assigning
const DBconn = async ()=>{
    try{
        try{
            await connect(process.env.DB_URL)
            console.log("db connected!!!")  
        } catch(err) { console.log("db error occured!!",err.message) }
        
        try {app.listen(process.env.PORT,()=>console.log(`listening on port......${process.env.PORT}`)) }        
        catch (err) { console.log("port error occured!!",err.message)}    
    }

    catch(err)
    {console.log(err)}
}

//middlewares 

app.use(exp.json({ limit: '50mb' }));
app.use(exp.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser()) // for cookies

DBconn()
app.use ('/user-api',userApp)
app.use ('/file-api',fileApp)
