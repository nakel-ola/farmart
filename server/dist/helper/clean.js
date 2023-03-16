"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clean(obj) {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj;
}
exports.default = clean;
