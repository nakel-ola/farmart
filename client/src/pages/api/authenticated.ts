const jwt = require('jsonwebtoken');
const xss = require('xss');
const { JWT_KEY } = require('./secret.js');
import type { NextApiRequest, NextApiResponse } from "next";


export const authenticated = (fn) => (req: NextApiRequest ,res: NextApiResponse) => {
  try {
    var token = req.headers.authorization!.split(" ")[1];
    var decodedToken = jwt.verify(xss(token),JWT_KEY);
    req.userId = decodedToken.id;
    fn(req,res);
  } catch (e: any) {
    res.status(402).json(e.message);
    console.log(e.message);
  }
  
}