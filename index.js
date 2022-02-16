import dotenv from 'dotenv';
import express  from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import userRoutes from './routes/user.js';
import documentRoutes from './routes/document.js';
var app = express();
dotenv.config({path:"./.env"});



app.get('/',(req,res)=>{
  res.send('Welcome to Document uploader api');
})
app.use(bodyParser.json({limit:"10mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"10mb",extended:true}));
app.use(cors());


// console.log('working');

app.use('/user',userRoutes);
app.use('/document',documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started at port: ${PORT}`));





