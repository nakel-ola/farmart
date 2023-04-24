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
exports.userSelect = exports.db = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("./config"));
const loaders_1 = require("./loaders");
const authenticated_1 = __importDefault(require("./middleware/authenticated"));
const models_1 = __importDefault(require("./models"));
exports.db = models_1.default;
const redis = new ioredis_1.default({
    host: config_1.default.redis_host,
    port: config_1.default.redis_port,
    password: config_1.default.redis_password,
});
exports.redis = redis;
const userSelect = {
    birthday: 1,
    email: 1,
    gender: 1,
    name: 1,
    phoneNumber: 1,
    photoUrl: 1,
    blocked: 1,
    level: 1,
    updatedAt: 1,
    createdAt: 1,
};
exports.userSelect = userSelect;
const context = ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authenticated_1.default)(req);
    return {
        req,
        res,
        db: models_1.default,
        redis,
        user,
        userLoader: loaders_1.userLoader,
        addressLoader: loaders_1.addressLoader,
        productLoader: loaders_1.productLoader,
    };
});
exports.default = context;
//# sourceMappingURL=context.js.map