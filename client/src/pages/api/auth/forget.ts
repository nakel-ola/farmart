// const fs = require('fs');
// const xss = require('xss');
// const { v4 } = require('uuid');
// const { authPath,validPath } = require('../secret.js');
import fs from 'fs';
import {v4} from "uuid"
import type { NextApiRequest, NextApiResponse } from "next";
import xss from 'xss';
import { authPath, validPath } from "../secret";


const validate = (fn) => (req: NextApiRequest,res: NextApiResponse) => {
  try {
    let name = xss(req.body.name);
    let email = xss(req.body.email);
    
    if(!name || !email){
      res.status(401).json({ msg: 'Please enter all fields',type: 'error'});
      return;
    }
    
    fs.readFile(authPath,'utf8',(err: any,data: any) => {
      let newArray = JSON.parse(data);
      let isRegistered = newArray.find((d: any) => d.email === email);
      if(!isRegistered) {
        res.status(404).json({msg: "Email ID already registered", type: 'error'});
        return;
      }
    });
    
    fs.readFile(validPath,'utf8',(err,data: any) => {
      let newArray = JSON.parse(data);
      let index = newArray.findIndex((arr: any) => arr.email === email);
      
      if(index >= 0) {
        newArray.splice(index,1);
        const newValid = JSON.stringify(newArray);
        fs.writeFile(validPath,newValid,'utf8',() => {});
      }
      fn(req,res);
    });
  } catch (e) {
    console.log(e);
  }
}

export default validate(async function Forget(req: NextApiRequest,res: NextApiResponse) {
  try {
    let name = xss(req.body.name);
    let email = xss(req.body.email);
    let id = xss(v4());
    
    
    fs.readFile(authPath,'utf8',(err,data: any) => {
      let newData = JSON.parse(data);
    
      let isEmail = newData.find((arr: any) => arr.email === email);
      
      let isName = newData.find((arr: any) => arr.name.trim() === name.trim());
      
      if(!isEmail || !isName) {
        res.status(401).json({msg: 'User not found',type: 'error' });
        return;
      }
        
      fs.readFile(validPath,'utf8', (err,data: any) => {
        const newArray = JSON.parse(data);
        let obj = [
          ...newArray,
          { name,email,validationToken: id }
        ];
        let json = JSON.stringify(obj);
        fs.writeFile(validPath, json, 'utf8',() => {
          res.status(200).json({validationToken: id,type: 'success'});
        });
      });
    });
  } catch (e: any) {
    res.status(401).json({ msg: 'Something went wrong', type: 'error' });
    console.log(e.message)
  }
});