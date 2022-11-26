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
exports.deleteFile = exports.ImageUplaod = exports.getListFiles = exports.bucket = void 0;
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const config_1 = __importDefault(require("../config"));
const serviceKey = path_1.default.join(__dirname, config_1.default.storage_credentials_path);
const storage = new storage_1.Storage({
    keyFilename: serviceKey,
    projectId: config_1.default.storage_project_id
});
exports.bucket = storage.bucket(config_1.default.storage_bucket_name);
const getListFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [files] = yield exports.bucket.getFiles();
        let fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file.name,
                url: file.metadata.mediaLink,
            });
        });
        console.log(fileInfos);
        return fileInfos;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getListFiles = getListFiles;
const ImageUplaod = ({ filename, createReadStream, }) => new Promise((resolve, reject) => {
    const blob = exports.bucket.file(filename);
    let stream = createReadStream();
    stream
        .pipe(exports.bucket.file(filename).createWriteStream({
        resumable: false,
        gzip: true,
    }))
        .on("error", (err) => reject(err)) // reject on error
        .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${exports.bucket.name}/${blob.name}`);
        try {
            yield exports.bucket.file(filename).makePublic();
        }
        catch (_a) {
            console.log(`Uploaded the file successfully: ${filename}, but public access is denied!`);
        }
        console.log(publicUrl);
        resolve({ url: publicUrl, name: filename });
    }));
});
exports.ImageUplaod = ImageUplaod;
const deleteFile = ({ fileName }) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.bucket.file(fileName).delete(); });
exports.deleteFile = deleteFile;
