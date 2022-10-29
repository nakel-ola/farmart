"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
const jwt = require('jsonwebtoken');
const xss = require('xss');
const { JWT_KEY } = require('./secret.js');
const authenticated = (fn) => (req, res) => {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var decodedToken = jwt.verify(xss(token), JWT_KEY);
        req.userId = decodedToken.id;
        fn(req, res);
    }
    catch (e) {
        res.status(402).json(e.message);
        console.log(e.message);
    }
};
exports.authenticated = authenticated;
