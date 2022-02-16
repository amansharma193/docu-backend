import dotenv from 'dotenv';
dotenv.config({path:"./.env"});
import admin from 'firebase-admin';
import config from './config.js';

const firebase = admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.BUCKET_URL
});
export default firebase;