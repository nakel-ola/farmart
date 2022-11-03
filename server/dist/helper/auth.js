"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const gcredentials_json_1 = __importDefault(require("../data/gcredentials.json"));
const { client_secret, client_id, redirect_uris } = gcredentials_json_1.default.web;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GMAIL_SCOPES,
});
console.log('Authorize this app by visiting this url:', url);
