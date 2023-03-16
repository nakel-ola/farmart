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
const currencies_json_1 = __importDefault(require("../../../data/currencies.json"));
const getDel_1 = __importDefault(require("../../../helper/getDel"));
const createProduct = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db } = ctx;
        const data = Object.assign(Object.assign({}, args.input), { rating: defaultRating, currency: currencies_json_1.default[0] });
        const newData = yield db.products.create(data);
        if (!newData)
            throw new Error("Something went wrong");
        // getting cache data from redis if available
        yield (0, getDel_1.default)([
            `products*`,
            "product-summary",
            "product*",
            "product-search*",
            "favorite*",
            "favorites*",
        ]);
        return { message: "Created successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
const defaultRating = [
    {
        name: "5",
        value: 0,
    },
    {
        name: "4",
        value: 0,
    },
    {
        name: "3",
        value: 0,
    },
    {
        name: "2",
        value: 0,
    },
    {
        name: "1",
        value: 0,
    },
];
exports.default = createProduct;
