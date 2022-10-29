const fs = require('fs');
const xss = require('xss');
const { productsPath } = require('../secret.js');
import type { NextApiRequest, NextApiResponse } from "next";


export default async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  let genre = xss(req.query.genre);
  try {
    if(req.method === 'GET'){
      if(genre){
        fs.readFile(productsPath,'utf8',(err: Error,data: any) => {
          let newArray = JSON.parse(data);
  
          let filterData = newArray.filter((arr: any) => arr.category.includes(genre));
          
          return res.status(200).json(filterData);
        });
      }
    }else {
      res.status(405).json({
        error: { message: 'Method not allowed.' },
      })
    }
  } catch (e: any) {
  res.status(401).json({msg: e.message})
  console.log(e)
}
}