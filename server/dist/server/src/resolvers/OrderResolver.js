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
const mongoose_1 = __importDefault(require("mongoose"));
const xss_1 = __importDefault(require("xss"));
const index_1 = require("../helper/index");
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const createOrder = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = args.input, userId = (0, xss_1.default)(req.userId), paymentMethod = (0, xss_1.default)(input.paymentMethod), deliveryMethod = (0, xss_1.default)(input.deliveryMethod), address = {
            id: (0, xss_1.default)(input.address.id),
            name: (0, xss_1.default)(input.address.name),
            street: (0, xss_1.default)(input.address.street),
            city: (0, xss_1.default)(input.address.city),
            state: (0, xss_1.default)(input.address.state),
            phoneNumber: (0, xss_1.default)(input.address.phoneNumber),
            phoneNumber2: (0, xss_1.default)(input.address.phoneNumber2),
            country: (0, xss_1.default)(input.address.country),
            info: (0, xss_1.default)(input.address.info),
        }, products = input.products.map((p) => ({
            id: (0, xss_1.default)(p.id),
            price: (0, xss_1.default)(p.price),
            quantity: Number((0, xss_1.default)(p.quantity.toString())),
        })), totalPrice = (0, xss_1.default)(input.totalPrice), progress = [
            {
                name: "placed",
                checked: false,
            },
            {
                name: "processed",
                checked: false,
            },
            {
                name: "delivered",
                checked: false,
            },
            {
                name: "completed",
                checked: false,
            },
        ], orderId = (0, index_1.nanoid)(15), trackingId = (0, index_1.nanoid)(), paymentId = (0, index_1.nanoid)(), status = "Pending";
        const data = {
            orderId,
            userId,
            totalPrice,
            status,
            paymentMethod,
            deliveryMethod,
            address,
            products,
            trackingId,
            paymentId,
            progress,
        };
        const newData = yield models_1.default.orderSchema.create(data);
        if (newData) {
            return {
                id: newData._id.toString(),
                orderId,
                trackingId,
                userId,
            };
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const orders = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, page = Number((0, xss_1.default)((_a = args.input.page.toString()) !== null && _a !== void 0 ? _a : "1")), status = (0, xss_1.default)(args.input.status), customerId = (0, xss_1.default)(args.input.customerId), limit = Number((0, xss_1.default)((_b = args.input.limit.toString()) !== null && _b !== void 0 ? _b : "10")), start = (page - 1) * limit, end = limit + start;
        if (!status) {
            const orders = yield (admin
                ? customerId
                    ? models_1.default.orderSchema.find({ userId: customerId })
                    : models_1.default.orderSchema.find()
                : models_1.default.orderSchema.find({ userId }));
            return {
                status,
                page,
                totalItems: orders.length,
                results: orders.slice(start, end),
            };
        }
        const orders = yield (admin
            ? models_1.default.orderSchema.find({ status })
            : models_1.default.orderSchema.find({ userId, status }));
        return {
            status,
            page,
            totalItems: orders.length,
            results: orders.slice(start, end),
        };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const order = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), orderId = (0, xss_1.default)(args.id), admin = req.admin;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw new Error("User ID must be a valid");
        }
        const order = yield (admin
            ? models_1.default.orderSchema.findOne({ _id: orderId })
            : models_1.default.orderSchema.findOne({ userId, _id: orderId }));
        return order;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const updateProgress = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, orderId = (0, xss_1.default)(args.input.id), name = (0, xss_1.default)(args.input.name);
        if (!admin) {
            throw Error("You don't have permission to edit this order");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw new Error("User ID must be a valid");
        }
        const data = yield models_1.default.orderSchema.updateOne({ _id: orderId, "progress.name": name }, { $set: { "progress.$.name": name, "progress.$.checked": true } });
        return { msg: "Update successful" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const filterById = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, orderId = (0, xss_1.default)(args.input.orderId), page = Number((0, xss_1.default)((_c = args.input.page.toString()) !== null && _c !== void 0 ? _c : "1")), limit = Number((0, xss_1.default)((_d = args.input.limit.toString()) !== null && _d !== void 0 ? _d : "10")), start = (page - 1) * limit, end = limit + start;
        const orders = yield (admin
            ? models_1.default.orderSchema.find({ orderId: new RegExp(orderId, "i") })
            : models_1.default.orderSchema.find({ orderId: new RegExp(orderId, "i"), userId }));
        return {
            status: "",
            page,
            totalItems: orders.length,
            results: orders.slice(start, end),
        };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const filterByStatus = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, page = Number((0, xss_1.default)((_e = args.input.page.toString()) !== null && _e !== void 0 ? _e : "1")), status = (0, xss_1.default)(args.input.status), limit = Number((0, xss_1.default)((_f = args.input.limit.toString()) !== null && _f !== void 0 ? _f : "10")), start = (page - 1) * limit, end = limit + start;
        let isAll = status === "all";
        let orders;
        if (admin) {
            if (isAll) {
                orders = yield models_1.default.orderSchema.find();
            }
            else {
                orders = yield models_1.default.orderSchema.find({
                    progress: {
                        $elemMatch: {
                            name: status,
                            checked: true,
                        },
                    },
                });
            }
        }
        else {
            if (isAll) {
                orders = yield models_1.default.orderSchema.find({ userId });
            }
            else {
                orders = yield models_1.default.orderSchema.find({
                    userId,
                    progress: {
                        $elemMatch: {
                            name: status,
                            checked: true,
                        },
                    },
                });
            }
        }
        return {
            status,
            page,
            totalItems: orders.length,
            results: orders.slice(start, end),
        };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
exports.default = {
    createOrder,
    orders,
    order,
    updateProgress,
    filterById,
    filterByStatus,
};
