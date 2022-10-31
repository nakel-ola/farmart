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
exports.getListFiles = exports.bucket = void 0;
const storage_1 = require("@google-cloud/storage");
const config_1 = __importDefault(require("../config"));
const storage = new storage_1.Storage({
    projectId: config_1.default.firebase_project_id,
    token: config_1.default.firebase_token,
    credentials: {
        private_key: config_1.default.firebase_private_key,
        client_email: config_1.default.firebase_client_email,
        client_id: config_1.default.firebase_client_id,
        token_url: config_1.default.firebase_token_url,
    },
});
exports.bucket = storage.bucket("gs://farmart-8bdb8.appspot.com/");
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
        // res.status(200).send(fileInfos);
    }
    catch (err) {
        console.log(err);
        // res.status(500).send({
        //   message: "Unable to read list of files!",
        // });
    }
});
exports.getListFiles = getListFiles;
