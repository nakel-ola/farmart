"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toJson = (data) => {
    if (typeof data === "object")
        return data.toJson();
    if (Array.isArray(data))
        return data.map((data) => data.toJson());
};
exports.default = toJson;
//# sourceMappingURL=toJson.js.map