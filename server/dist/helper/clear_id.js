"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getNewKey = (key) => (key === "_id" ? "id" : key);
const clear_id = (obj) => {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++)
            clear_id(obj[i]);
    }
    else if (typeof obj === "object") {
        for (const key in obj) {
            const newKey = getNewKey(key);
            if (newKey !== key)
                obj[newKey] = obj[key].toString();
            if (key !== newKey)
                delete obj[key];
            clear_id(obj[newKey]);
        }
    }
    return obj;
};
exports.default = clear_id;
//# sourceMappingURL=clear_id.js.map