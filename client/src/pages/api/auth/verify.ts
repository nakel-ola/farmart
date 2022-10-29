const fs = require('fs');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const bcryptjs = require('bcryptjs');
const { v4 } = require('uuid');
const { JWT_KEY,authPath,validPath,expiresIn } = require('../secret.js');
import type { NextApiRequest, NextApiResponse } from "next";



const validate = (fn) => (req: NextApiRequest,res: NextApiResponse) => {
  try {
    let name = xss(req.body.name);
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let validationToken = xss(req.body.validationToken);
    
    if(!name || !email || !validationToken || !password) {
      res.status(404).json({ msg: 'Please enter all fields', type: 'error' });
      return;
    }
      
    if(password.trim().length < 8) {
      res.status(401).json({ msg: 'Password must be at least 8 characters',type: 'error'});
      return;
    }
      
    fs.readFile(validPath,'utf8',(err: Error,data: any) => {
      let newArray = JSON.parse(data);
      let isValid = newArray.find((arr: any) => arr.validationToken === validationToken);
      if(!isValid) {
        res.status(401).json({ msg: "Wujo can't validate you", type: 'error' });
        return;
      }
    });
    
    fs.readFile(authPath,'utf8',(err: Error,data: any) => {
      const newArray = JSON.parse(data);
      
      const isRegistered = newArray.find((d: any) => d.email === email);
      
      if(!isRegistered) {
        res.status(404).json({msg: "Email ID already registered", type: 'error'});
        return;
      }
      
      fn(req,res);
    });
  } catch (e) {
    console.log(e);
  }
}

const removeValidatedAccount = (req: NextApiRequest) => {
  let validationToken = xss(req.body.validationToken);

  fs.readFile(validPath,'utf8',(err: Error,data: any) => {
    let newArray = JSON.parse(data);
    const index = newArray.findIndex((arr: any) => arr.validationToken === validationToken);
    newArray.splice(index,1);
    const newValid = JSON.stringify(newArray);
    fs.writeFile(validPath,newValid,'utf8',() => {});
  });
}

export default validate(async function Verify(req: NextApiRequest,res: NextApiResponse) {
  let name = xss(req.body.name);
  let email = xss(req.body.email);
  let password = xss(req.body.password);
  let validationToken = xss(req.body.validationToken);
  
  
  try {
    fs.readFile(authPath,'utf8',async(err: Error,data: any) => {
      let userArray = JSON.parse(data);
      let isRegistered = userArray.find((arr: any) => arr.email === email);
      
      if(!isRegistered) {
        res.status(401).json({msg: 'User not found',type: 'error' });
        return;
      }
      
      await bcryptjs.genSalt(12, async (err: Error,salt: any) => {
        await bcryptjs.hash(password, salt,(err: Error,hash: any) => {
          isRegistered.password = hash;
          isRegistered.signIn = new Date().toUTCString();
          
          
          let json = JSON.stringify(userArray);
          fs.writeFile(authPath, json, 'utf8', () => {
            const token = jwt.sign({ id: isRegistered.id, name, email }, JWT_KEY, { expiresIn });
            res.status(200).json({
              token,
              type: 'success'});
            removeValidatedAccount(req);
          });
        })
      });
    });
  } catch (e: any) {
    res.status(401).json({ msg: 'First error', type: 'error' });
    console.log(e.message);
  }
});