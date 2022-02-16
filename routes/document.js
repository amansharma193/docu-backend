import express from 'express';
import { createDocument,getDocuments } from '../controllers/document.js';
import multer from 'multer';
const upload=multer({storage: multer.memoryStorage()});
const router=express.Router();

router.post('/',upload.single('file'),createDocument);

router.get('/:id',getDocuments);


export default router;