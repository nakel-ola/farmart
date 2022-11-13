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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __importDefault(require("stream"));
const util_1 = require("util");
require("../config");
const dataUrlToFile_1 = __importDefault(require("../helper/dataUrlToFile"));
const gcloud_1 = require("../helper/gcloud");
const createFileStream = (file) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const blob = gcloud_1.bucket.file(file.fileName);
    let buffer = yield (0, dataUrlToFile_1.default)(file);
    var bufferStream = new stream_1.default.PassThrough();
    bufferStream.end(buffer);
    bufferStream
        .pipe(gcloud_1.bucket.file(file.fileName).createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
            contentType: file.mimeType,
            metadata: {
                custom: "metadata",
            },
        },
    }))
        .on("error", (err) => {
        reject(err);
        console.log(err);
    })
        .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${gcloud_1.bucket.name}/${blob.name}`);
        try {
            yield gcloud_1.bucket.file(file.fileName).makePublic();
        }
        catch (_a) {
            console.log(`Uploaded the file successfully: ${file.fileName}, but public access is denied!`);
        }
        console.log(publicUrl);
        resolve({ url: publicUrl, name: file.fileName });
    }));
}));
const uploadFile = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let file = args.input;
        const data = yield createFileStream(file);
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
});
exports.default = {
    uploadFile,
};
