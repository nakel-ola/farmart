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
const xss_1 = __importDefault(require("xss"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const mongoose_1 = __importDefault(require("mongoose"));
const createAddress = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = args.input, userId = req.userId, name = (0, xss_1.default)(input.name), street = (0, xss_1.default)(input.street), city = (0, xss_1.default)(input.city), state = (0, xss_1.default)(input.state), country = (0, xss_1.default)(input.country), info = (input === null || input === void 0 ? void 0 : input.info) ? (0, xss_1.default)(input === null || input === void 0 ? void 0 : input.info) : null, phoneNumber = (0, xss_1.default)(input.phoneNumber), phoneNumber2 = (input === null || input === void 0 ? void 0 : input.phoneNumber2) ? (0, xss_1.default)(input === null || input === void 0 ? void 0 : input.phoneNumber2) : null;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        const newAddress = {
            name,
            street,
            city,
            state,
            country,
            info,
            phoneNumber,
            phoneNumber2,
            default: false
        };
        yield models_1.default.userSchema.updateOne({ _id: userId }, { $push: { addresses: newAddress } });
        return { msg: "Successfully added address" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const modifyAddress = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = args.input, userId = req.userId, id = (0, xss_1.default)(input.id), name = (0, xss_1.default)(input.name), street = (0, xss_1.default)(input.street), city = (0, xss_1.default)(input.city), state = (0, xss_1.default)(input.state), country = (0, xss_1.default)(input.country), info = (0, xss_1.default)(input === null || input === void 0 ? void 0 : input.info), phoneNumber = (0, xss_1.default)(input.phoneNumber), phoneNumber2 = (0, xss_1.default)(input === null || input === void 0 ? void 0 : input.phoneNumber2);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        const newAddress = {
            "addresses.$.name": name,
            "addresses.$.street": street,
            "addresses.$.city": city,
            "addresses.$.state": state,
            "addresses.$.country": country,
            "addresses.$.info": info,
            "addresses.$.phoneNumber": phoneNumber,
            "addresses.$.phoneNumber2": phoneNumber2,
        };
        yield models_1.default.userSchema.updateOne({ _id: userId, "addresses._id": id }, { $set: newAddress });
        return {
            msg: "Updated address",
        };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const addresses = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (0, xss_1.default)(req.userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        const data = yield models_1.default.userSchema.findOne({ _id: userId }, { addresses: 1 });
        return (_a = data.addresses) !== null && _a !== void 0 ? _a : [];
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const address = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, xss_1.default)(req.userId), id = (0, xss_1.default)(args.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        const data = yield models_1.default.userSchema.findOne({ _id: userId });
        return data.addresses.find((address) => address.id === id);
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const deleteAddress = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, xss_1.default)(req.userId), id = (0, xss_1.default)(args.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        yield models_1.default.userSchema.updateOne({ _id: userId }, { $pull: { addresses: { _id: id } } });
        return { msg: "Deleted" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
exports.default = {
    createAddress,
    addresses,
    address,
    deleteAddress,
    modifyAddress,
};
