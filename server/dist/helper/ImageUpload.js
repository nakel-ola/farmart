"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _1 = require(".");
const ImageUplaod = ({ filename, createReadStream, }) => new Promise((resolve, reject) => {
    let name = (0, _1.nanoid)(5) + "-" + filename;
    let url = `http://localhost:4000/images/${name}`;
    let stream = createReadStream();
    stream
        .pipe(fs_1.default.createWriteStream(path_1.default.resolve(__dirname, `../../public/images/${name}`)))
        .on("finish", () => resolve({ url, name }))
        .on("error", (e) => reject(e));
});
exports.default = ImageUplaod;
