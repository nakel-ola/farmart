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
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const xss_1 = __importDefault(require("xss"));
const calculateDiscount_1 = __importDefault(require("../helper/calculateDiscount"));
const index_1 = require("../helper/index");
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const createOrder = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const input = args.input, userId = (0, xss_1.default)((_a = req.userId) !== null && _a !== void 0 ? _a : req.headers["userid"].toString()), paymentMethod = (0, xss_1.default)(input.paymentMethod), deliveryMethod = (0, xss_1.default)(input.deliveryMethod), shippingFee = input.shippingFee ? (0, xss_1.default)(input.shippingFee) : null, pickup = input.pickup ? (0, xss_1.default)(input.pickup) : null, address = input.address
            ? {
                id: (0, xss_1.default)(input.address.id),
                name: (0, xss_1.default)(input.address.name),
                street: (0, xss_1.default)(input.address.street),
                city: (0, xss_1.default)(input.address.city),
                state: (0, xss_1.default)(input.address.state),
                phoneNumber: (0, xss_1.default)(input.address.phoneNumber),
                phoneNumber2: (0, xss_1.default)(input.address.phoneNumber2),
                country: (0, xss_1.default)(input.address.country),
                info: (0, xss_1.default)(input.address.info),
            }
            : null, coupon = input.coupon
            ? {
                id: (0, xss_1.default)(input.coupon.id),
                email: (0, xss_1.default)(input.coupon.email),
                discount: (0, xss_1.default)(`${input.coupon.discount}`),
                code: (0, xss_1.default)(input.coupon.code),
                userId: (0, xss_1.default)(input.coupon.userId),
                description: (0, xss_1.default)(input.coupon.description),
                expiresIn: (0, xss_1.default)(`${input.coupon.expiresIn}`),
            }
            : null, products = input.products.map((p) => ({
            id: (0, xss_1.default)(p.id),
            price: (0, xss_1.default)(p.price),
            quantity: Number((0, xss_1.default)(p.quantity.toString())),
        })), totalPrice = (0, xss_1.default)(input.totalPrice), phoneNumber = input.phoneNumber ? (0, xss_1.default)(input.phoneNumber) : null, progress = [
            {
                name: "pending",
                checked: true,
            },
            {
                name: "canceled",
                checked: false,
            },
            {
                name: "delivered",
                checked: false,
            },
        ], orderId = (0, index_1.nanoid)(15), trackingId = (0, index_1.nanoid)(), paymentId = (0, index_1.nanoid)(), status = "pending";
        let price = Number((_b = (0, calculateDiscount_1.default)(Number(totalPrice), coupon ? Number(coupon.discount) : 0) + Number(shippingFee)) !== null && _b !== void 0 ? _b : 0).toFixed(2);
        const data = {
            orderId,
            userId,
            totalPrice: price,
            status,
            paymentMethod,
            deliveryMethod,
            address,
            products,
            trackingId,
            paymentId,
            progress,
            pickup,
            shippingFee,
            coupon,
            phoneNumber,
        };
        const newData = yield models_1.default.orderSchema.create(data);
        if (newData) {
            yield decrementProduct(products);
            if (coupon) {
                yield deleteCoupon(coupon.id);
            }
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
const decrementProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        yield models_1.default.productSchema.updateOne({ id: element.id }, {
            $inc: { stock: -Number(element.quantity) },
        });
    }
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.default.couponSchema.findByIdAndDelete(id);
});
const orders = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, page = Number((0, xss_1.default)((_c = args.input.page.toString()) !== null && _c !== void 0 ? _c : "1")), status = (0, xss_1.default)(args.input.status), customerId = (0, xss_1.default)(args.input.customerId), limit = Number((0, xss_1.default)((_d = args.input.limit.toString()) !== null && _d !== void 0 ? _d : "10")), start = (page - 1) * limit, end = limit + start;
        if (!status) {
            const orders = yield (admin
                ? customerId
                    ? models_1.default.orderSchema.find({ userId: customerId })
                    : models_1.default.orderSchema.find()
                : models_1.default.orderSchema.find({ userId }));
            return {
                __typename: "OrderData",
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
            __typename: "OrderData",
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
        const data = (0, lodash_1.merge)({ __typename: "Order" }, order);
        return data;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const updateProgress = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, orderId = (0, xss_1.default)(args.input.id), name = (0, xss_1.default)(args.input.name);
        if (name !== "canceled" && !admin) {
            throw Error("You don't have permission to edit this order");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw new Error("User ID must be a valid");
        }
        yield models_1.default.orderSchema.updateOne({ _id: orderId, "progress.name": name }, {
            status: name,
            $set: { "progress.$.name": name, "progress.$.checked": true },
        });
        return { msg: "Update successful" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const filterById = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, orderId = (0, xss_1.default)(args.input.orderId), page = Number((0, xss_1.default)((_e = args.input.page.toString()) !== null && _e !== void 0 ? _e : "1")), limit = Number((0, xss_1.default)((_f = args.input.limit.toString()) !== null && _f !== void 0 ? _f : "10")), start = (page - 1) * limit, end = limit + start;
        const orders = yield (admin
            ? models_1.default.orderSchema.find({ orderId: new RegExp(orderId, "i") })
            : models_1.default.orderSchema.find({ orderId: new RegExp(orderId, "i"), userId }));
        return {
            __typename: "OrderData",
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
    var _g, _h;
    try {
        let userId = (0, xss_1.default)(req.userId), admin = req.admin, page = Number((0, xss_1.default)((_g = args.input.page.toString()) !== null && _g !== void 0 ? _g : "1")), status = (0, xss_1.default)(args.input.status), limit = Number((0, xss_1.default)((_h = args.input.limit.toString()) !== null && _h !== void 0 ? _h : "10")), start = (page - 1) * limit, end = limit + start;
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
            __typename: "OrderData",
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
const ordersSummary = (0, authenticated_1.default)((_, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin;
        if (!admin) {
            throw new Error("You don,t have permission");
        }
        const orders = yield models_1.default.orderSchema.find();
        const data = {
            __typename: "OrderSummary",
            pending: orders.filter(order => order.status === "pending").length,
            delivered: orders.filter(order => order.status === "delivered").length,
            canceled: orders.filter(order => order.status === "canceled").length,
        };
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const ordersStatistics = (0, authenticated_1.default)((_, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin;
        if (!admin) {
            throw new Error("You don,t have permission");
        }
        const orders = yield models_1.default.orderSchema.find({}, { totalPrice: 1, progress: 1, createdAt: 1, updatedAt: 1 });
        let totals = orders.length > 0 ? orders.map((order) => Number(order.totalPrice)) : [];
        const data = {
            __typename: "OrderStatistics",
            min: 0,
            max: 136 !== null && 136 !== void 0 ? 136 : Math.round(Math.max(...totals)),
            week: [0, 86, 28, 115, 48, 210, 136],
            month: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
        };
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    createOrder,
    orders,
    order,
    updateProgress,
    filterById,
    filterByStatus,
    ordersSummary,
    ordersStatistics
};
