import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {userApp} from './APIs/UserAPI.js'
import { fileApp } from './APIs/fileAPi.js'

config()
const app = exp()
const allowedOrigins = [
    'https://cloudvault-tsfx.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
]
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''))
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(cleanOrigin) || 
            (cleanOrigin.includes('cloudvault') && cleanOrigin.includes('onrender.com'))) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 
}))

// DB connection and port assigning
const DBconn = async ()=>{
    try{
        try{
            await connect(process.env.DB_URL)
            console.log("db connected!!!")  
        } catch(err) { console.log("db error occured!!",err.message) }
        
        try {
            const port = process.env.PORT || 7777
            app.listen(port,()=>console.log(`listening on port......${port}`)) }        
        catch (err) { console.log("port error occured!!",err.message)}    
    }

    catch(err)
    {console.log(err)}
}

//middlewares 

app.use(exp.json({ limit: '50mb' }));
app.use(exp.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser()) // for cookies

app.use ('/user-api',userApp)
app.use ('/file-api',fileApp)
DBconn()
