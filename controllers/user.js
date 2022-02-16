import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import firebase from '../config/firebase_connect.js';
let db=firebase.firestore();
let collection=db.collection('Users');

export const signin= async(req,res)=>{
  const {email,password} = req.body;
  try{
    var existingUser=await collection.where('email','==',email).get();
    if(existingUser._size==0) return res.status(404).json({message:"User not found with this email : "+email});
    // console.log();
    var pass = existingUser._fieldsProto.password.stringValue;
    const isPasswordCorrect = bcrypt.compare(password,pass);
    if(!isPasswordCorrect) return res.status(400).json({message:"Wrong Password. "});
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({email:email,password:pass},SECRET_KEY,{expiresIn:"1h"});    
    res.status(200).json({result:{email:email,username:existingUser._fieldsProto.username.stringValue},token});
  }catch(err){
    res.status(500).json({message:'Something went wrong. Please try again later.'});
  }
}

export const signup= async(req,res)=>{
  const {email,password,username,id} = req.body;
  try{
    var existingUser=await collection.where('email','==',email).get();
    if(existingUser._size>0) return res.status(400).json({message:"User exist with this email : "+email});
    let name = await collection.doc();
    let key = name._path.segments[1];
    console.log('path ',name,key);
    const hashPassword = await bcrypt.hash(password, 12);
    const result = {username,email,password:hashPassword,id:key};
    await collection.doc(key).set(result);
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({email:email,id:key},SECRET_KEY,{expiresIn:"1h"});
    res.status(200).json({result:result,token});
  }catch(err){
    res.status(500).json({message:'Something went wrong. Please try again later.',error:err});
  }
}