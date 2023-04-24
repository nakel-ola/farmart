"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayMerge(arr1, arr2, type = "id") {
    const seen = new Set();
    const data = [...arr1, ...arr2];
    const result = data.filter((el) => {
        const duplicate = seen.has(el);
        seen.add(el);
        return !duplicate;
    });
    return result;
}
exports.default = arrayMerge;
//# sourceMappingURL=arrayMerge.js.map