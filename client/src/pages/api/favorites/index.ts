const fs = require('fs');
const xss = require('xss');
const { favoritesPath } = require('../secret.js');
const { authenticated } = require('../authenticated.js');
import type { NextApiRequest, NextApiResponse } from "next";


export default authenticated(async function Favorites(req: NextApiRequest,res: NextApiResponse) {
  try {
    let userId = xss(req.userId);
    
    if(req.method === 'GET') {
      fs.readFile(favoritesPath,'utf8',(err: Error,data: any) => {
        let newData = JSON.parse(data);
        
        const userFavorites = newData.find((d: any) => d.userId === userId);
       
        res.status(200).json(userFavorites ? userFavorites.data : []);
      });
    }
  } catch (e) {
    console.log(e);
  }
});