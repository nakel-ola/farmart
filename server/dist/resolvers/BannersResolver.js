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
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const xss_1 = __importDefault(require("xss"));
const banners = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield models_1.default.bannerSchema.find();
    return data;
});
const createBanner = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, image = args.input.image, title = (0, xss_1.default)(args.input.title), description = (0, xss_1.default)(args.input.description), link = (0, xss_1.default)(args.input.link);
        if (!admin) {
            throw new Error("You don't have permission");
        }
        const newImage = yield (0, ImageUpload_1.default)(image.file);
        yield models_1.default.bannerSchema.create({ image: newImage.url, link, title, description });
        return { msg: "Banner created successfully" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const deleteBanner = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, id = args.id;
        if (!admin) {
            throw new Error("You don't have permission");
        }
        yield models_1.default.bannerSchema.deleteOne({ _id: id });
        return { msg: "Banner deleted successfully" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    banners,
    createBanner,
    deleteBanner,
};
