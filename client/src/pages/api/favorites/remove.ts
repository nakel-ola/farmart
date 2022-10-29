const fs = require('fs');
const xss = require('xss');
const { favoritesPath } = require('../secret.js');
const { authenticated } = require('../authenticated.js');
import type { NextApiRequest, NextApiResponse } from "next";



export default authenticated(async function Remove(req: NextApiRequest,res: NextApiResponse) {
  try {
    let id = xss(req.body.id);
    let userId = xss(req.userId);


    if(req.method === 'POST') {
      fs.readFile(favoritesPath,'utf8',(err: Error,data: any) => {
        
        let newData = JSON.parse(data);
        
        const userFavorites = newData.find((d: any) => d.userId === userId);
        
        if(!userFavorites) {
          res.status(404).json({msg: 'Who the fuck are u ???'}); 
          return;
        }

        const index = userFavorites.data.findIndex((d: any) => d.id === id);
        
        if(index < 0) {
          res.status(404).json({msg: 'not Found'});
          return;
        }
        
        userFavorites.data.splice(index,1);

        fs.writeFile(favoritesPath,JSON.stringify(newData),'utf8',(err: Error,data: any) => {
          res.status(200).json({ msg: 'Success'});
        });
        
      });
    }
  } catch (e) {
    console.log(e);
  }
});