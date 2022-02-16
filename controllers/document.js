import firebase from "../config/firebase_connect.js";
import saltedMd5 from 'salted-md5';
import path from "path";
import multer from 'multer';
const upload=multer({storage: multer.memoryStorage()});
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/document-manager-5b419.appspot.com/o/'
const bucket = firebase.storage().bucket();
let db=firebase.firestore();
let collection=db.collection('Documents');
export const createDocument=async (req,res)=>{
  const id = req.body.id;
  // console.log('running...',req.body);
  const hashName = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
  const fileName = hashName + path.extname(req.file.originalname)
  const response = await bucket.file(fileName).createWriteStream().end(req.file.buffer);
  console.log(response);
  let name = await collection.doc();
  let mediaLink = fileURL+fileName+'?alt=media';
  let key = name._path.segments[1];
  let document = {fileURL:mediaLink,createdAt: new Date().getTime(),userId:id};
  await collection.doc(key).set(document);
  console.log('path ',name,key);
  res.status(200).json(document);
}

export const getDocuments = async (req,res)=>{

  const {id} = req.params;
  console.log('id running',id);
  const snapshot= await collection.where('userId','==',id).get();
  if (snapshot.empty) {
    return  res.status(404).json({message:"No documents founr for this user."});
  } 
  let responseArr=[];
  snapshot.forEach(doc=>responseArr.push(doc.data()));
  res.status(200).json(responseArr);
}