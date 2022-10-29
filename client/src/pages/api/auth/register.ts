// const fs = require('fs');
// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const xss = require('xss');
// const { v4 } = require('uuid');
// const { JWT_KEY,authPath,expiresIn } = require('../secret.js');
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import xss from "xss";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import fs from "fs";
import { JWT_KEY, authPath, expiresIn } from "../secret.js";

const validate = (fn) => async (req: NextApiRequest,res: NextApiResponse) => {
  try {
    if(req.method !== 'POST') {
      res.status(405).json({
        error: { message: 'Method not allowed.' },
      })
      return;
    }
    
    let name = xss(req.body.name);
    let email = xss(req.body.email);
    let password = xss(req.body.password)
    
    if (!name || !email || !password) {
      res.status(404).json({ msg: 'Please enter all fields', type: 'error' });
      return;
    }
    
    //------------ Checking password length ------------//
    if (password.trim().length < 8) {
      res.status(401).json({ msg: 'Password must be at least 8 characters',type: 'error'});
      return;
    }
 
    fs.readFile(authPath,'utf8',async(err,data: any) => {
      const newArray = JSON.parse(data);
      
      const isRegistered = newArray.find((d: any) => d.email === email);
      
      if(isRegistered) {
        res.status(404).json({msg: "Email ID already registered", type: 'error'});
        return;
      }
      
      fn(req,res);
      
      
    });
  } catch (e) {
    console.log(e);
  }
}

export default validate(async function Register(req: NextApiRequest,res: NextApiResponse) {
  try {
    if(req.method !== 'POST') {
      res.status(405).json({
        error: { message: 'Method not allowed.' },
      })
      return;
    }
    
    let name = xss(req.body.name);
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let id = xss(v4());
    
    fs.readFile(authPath,'utf8',async (e,data: any) => {
      let newData = JSON.parse(data);
      
      if(!e && newData) {
        await bcryptjs.genSalt(12, async (err: Error,salt: any) => {
          await bcryptjs.hash(password, salt, (err: Error,hash: any) => {

            const num = Math.floor(Math.random() * 33)

            let photoUrl = `http://localhost:4000/images/avatar-${num}.png`;
            
            let obj = [
              ...newData,
              {
                id,name,email,
                photoUrl,
                password: hash,
                addresses: [],
                card: [],
                userAgent: xss(req.headers['user-agent']),
                language: xss(req.headers['accept-language']),
                createdAt: new Date().toUTCString(),
                signIn: new Date().toUTCString(),
              }
            ];
            
            let json = JSON.stringify(obj);
            
            fs.writeFile(authPath, json, 'utf8', () => {
              const token = jwt.sign({ id, name, email.photoUrl }, JWT_KEY, { expiresIn});
              res.status(200).json({ 
                token,type: 'success' 
              });
            });
          });
        });
      }
    });
    
  } catch (e) {
    console.log(e)
  }
});