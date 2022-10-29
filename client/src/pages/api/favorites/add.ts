const fs = require('fs');
const xss = require('xss');
const { favoritesPath } = require('../secret.js');
const { authenticated } = require('../authenticated.js');
import type { NextApiRequest, NextApiResponse } from "next";


export default authenticated(async function Add(req: NextApiRequest,res: NextApiResponse) {
  try {
    let id = xss(req.body.id);
    let title = xss(req.body.title);
    let image = xss(req.body.image);
    let price = xss(req.body.price);
    let quantity = xss(req.body.quantity);
    let stock = xss(req.body.stock);
    let userId = xss(req.userId);
    
    
    if(req.method === 'POST') {
      fs.readFile(favoritesPath,'utf8',(err: Error,data: any) => {
        let newData = JSON.parse(data);
        
        const userFavorites = newData.find((d: any) => d.userId === userId);
        
        const product = userFavorites.data?.find((p: any) => p.id === id);
        
        if(!userFavorites){
          newData.push({
            userId,
            data: [{ id,title,image,price,quantity,stock }]
          });
        }else {
          if(!product) {
            userFavorites.data.push({id,title,image,price,quantity,stock });
          }
        }
        
        fs.writeFile(favoritesPath,JSON.stringify(newData),'utf8',(err: Error,data: any) => {
          res.status(200).json({ msg: 'Success'});
        });
        
      });
    }
  } catch (e: any) {
    console.log(e);
  }
});