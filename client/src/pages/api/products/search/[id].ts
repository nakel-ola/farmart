const fs = require('fs');
const xss = require('xss');
const { productsPath } = require('../../secret.js');
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getSearchProducts(req: NextApiRequest,res: NextApiResponse) {
  try {
    if(req.method === 'GET') {
      await fs.readFile(productsPath,'utf8',(err: Error,data: any) => {
        let newArray = JSON.parse(data);
          
        let filterData = newArray.filter((arr: any) => arr.title.toLowerCase().includes(xss(req.query.id.trim().toLowerCase())));
          
        console.log(filterData);
        
        res.status(201).json(filterData);
      });
    }else {
      res.status(405).json({
        error: { message: 'Method not allowed.' },
      })
    }
  } catch (e) {
    console.log(e);
  }
}