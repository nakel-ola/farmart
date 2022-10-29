import type { NextApiRequest, NextApiResponse } from "next";
import xss from "xss";
import jwt from "jsonwebtoken";
import fs from "fs";
import bcryptjs from "bcryptjs";

const { JWT_KEY,authPath,expiresIn } = require('../secret.js');

type Fn = (req: NextApiRequest,res: NextApiResponse) => void;

const validate = (fn: Fn) => (req: NextApiRequest,res: NextApiResponse) => {
  try {
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    
    if (!email || !password) {
      res.status(404).json({ msg: 'Please enter all fields', type: 'error' });
      return;
    }
    
    //------------ Checking password length ------------//
    if (password.trim().length < 8) {
      res.status(401).json({ msg: 'Pls, Enter your credentials correctly ',type: 'error'});
      return;
    }
    
    fs.readFile(authPath,'utf8',async(err,data: any) => {
      const newArray = JSON.parse(data);
      
      const isRegistered = newArray.find((d: any) => d.email === email);
      
      if(!isRegistered) {
        res.status(404).json({msg: "Pls,Enter your credentials correctly", type: 'error'});
        return;
      }
      
      if(isRegistered) {
        fn(req,res);
      }
    });
    
  } catch (e) {
    console.log(e);
  }
}


export default validate(async function Login(req: NextApiRequest,res: NextApiResponse) {
  try {
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    
    fs.readFile(authPath,'utf8',async (e,data: any) => {
      try {
       let newData = JSON.parse(data);
       
       let isRegistered = newData.find((d: any) => d.email === email);
       
       if(await bcryptjs.compare(password,isRegistered.password)){
         
        isRegistered.signIn = new Date().toUTCString();
              
        let json = JSON.stringify(newData);
         
        fs.writeFile(authPath, json, 'utf8',() => {
         const token = jwt.sign({id: isRegistered.id,name: isRegistered.name, email,photoUrl: isRegistered.photoUrl }, JWT_KEY, { expiresIn });
          res.status(201).json({ 
            token,type: 'success' 
          });
        });
         
       }else {
        res.status(401).json({ msg: 'Pls,Enter your credentials correctly',type:'error' });
      }
          
      } catch (e) {
        res.status(401).json({ msg: 'Something went wrong', type: 'error' });
        console.log(e);
      }
        
    });
    
  } catch (e: any) {
    console.log(e.message);
  }
});