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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDiscount_1 = __importDefault(require("../../../helper/calculateDiscount"));
const clean_1 = __importDefault(require("../../../helper/clean"));
const getdel_1 = __importDefault(require("../../../helper/getdel"));
const nanoid_1 = require("../../../helper/nanoid");
const models_1 = __importDefault(require("../../../models"));
const createOrder = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const _b = args.input, { totalPrice, coupon, shippingFee, products } = _b, others = __rest(_b, ["totalPrice", "coupon", "shippingFee", "products"]);
        const { user, req, db, redis } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        const price = Number((_a = (0, calculateDiscount_1.default)(Number(totalPrice), coupon ? Number(coupon.discount) : 0) + Number(shippingFee)) !== null && _a !== void 0 ? _a : 0).toFixed(2);
        const trackingId = (0, nanoid_1.nanoid)(), orderId = (0, nanoid_1.nanoid)(15);
        const data = (0, clean_1.default)(Object.assign({ orderId,
            userId, totalPrice: price, status: "pending", trackingId, progress: defaultProgress, shippingFee,
            coupon,
            products }, others));
        const newData = yield db.orders.create(data);
        if (!newData)
            throw new Error("Something went wrong");
        yield decrementProduct(products);
        if (coupon)
            yield deleteCoupon(coupon.id);
        // getting cache data from redis if available
        yield (0, getdel_1.default)([
            `filterById:${userId}*`,
            `filterByStatus:${userId}*`,
            `order:${userId}*`,
            `orders:${userId}*`,
            "orders-statistics",
            "order-summary",
        ]);
        return {
            id: newData._id.toString(),
            orderId,
            trackingId,
            userId,
        };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
const decrementProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        yield models_1.default.products.updateOne({ id: element.productId }, {
            $inc: { stock: -Number(element.quantity) },
        });
    }
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.default.coupons.findByIdAndDelete(id);
});
const defaultProgress = [
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
];
exports.default = createOrder;
