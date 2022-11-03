"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const gcredentials_json_1 = __importDefault(require("../data/gcredentials.json"));
// Replace with the code you received from Google
const code = '4/0ARtbsJqKMEighZsPw9UmRTrqsiB-lSc1n1W--TDnuOx1A8H2KPbt1XLC134m93-KBrlRMw&scope';
const { client_secret, client_id, redirect_uris } = gcredentials_json_1.default.web;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.getToken(code).then(({ tokens }) => {
    const tokenPath = path_1.default.join(__dirname, '../data/token.json');
    fs_1.default.writeFileSync("src/data/token.json", JSON.stringify(tokens));
    console.log('Access token and refresh token stored to token.json');
});
