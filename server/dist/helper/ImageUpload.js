"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("fs");
const util_1 = require("util");
const gcloud_1 = require("./gcloud");
const ImageUplaod = ({ filename, createReadStream, }) => new Promise((resolve, reject) => {
    const blob = gcloud_1.bucket.file(filename);
    let stream = createReadStream();
    stream
        .pipe(gcloud_1.bucket.file(filename).createWriteStream({
        resumable: false,
        gzip: true,
    }))
        .on("error", (err) => {
        reject(err);
    }) // reject on error
        .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${gcloud_1.bucket.name}/${blob.name}`);
        try {
            yield gcloud_1.bucket.file(filename).makePublic();
        }
        catch (_a) {
            console.log(`Uploaded the file successfully: ${filename}, but public access is denied!`);
        }
        resolve({ url: publicUrl, name: filename });
    }));
});
exports.default = ImageUplaod;
