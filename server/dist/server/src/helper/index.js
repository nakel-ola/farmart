"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nanoidV2 = exports.random = exports.customRandom = exports.customAlphabet = exports.nanoid = exports.urlAlphabet = void 0;
const crypto_1 = require("crypto");
const url_alphabet_1 = require("./url-alphabet");
Object.defineProperty(exports, "urlAlphabet", { enumerable: true, get: function () { return url_alphabet_1.urlAlphabet; } });
const POOL_SIZE_MULTIPLIER = 128;
let pool, poolOffset;
let fillPool = bytes => {
    if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        (0, crypto_1.randomFillSync)(pool);
        poolOffset = 0;
    }
    else if (poolOffset + bytes > pool.length) {
        (0, crypto_1.randomFillSync)(pool);
        poolOffset = 0;
    }
    poolOffset += bytes;
};
let random = bytes => {
    fillPool((bytes -= 0));
    return pool.subarray(poolOffset - bytes, poolOffset);
};
exports.random = random;
let customRandom = (alphabet, defaultSize, getRandom) => {
    let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
    let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);
    return (size = defaultSize) => {
        let id = '';
        while (true) {
            let bytes = getRandom(step);
            let i = step;
            while (i--) {
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === size)
                    return id;
            }
        }
    };
};
exports.customRandom = customRandom;
let customAlphabet = (alphabet, size = 21) => customRandom(alphabet, size, random);
exports.customAlphabet = customAlphabet;
let nanoid = (size = 21) => {
    fillPool(size -= 0);
    let id = '';
    for (let i = poolOffset - size; i < poolOffset; i++) {
        id += url_alphabet_1.urlAlphabet[pool[i] & 63];
    }
    return id;
};
exports.nanoid = nanoid;
let nanoidV2 = (alphabet, size = 21) => {
    fillPool(size -= 0);
    let id = '';
    for (let i = poolOffset - size; i < poolOffset; i++) {
        id += alphabet[pool[i] & 63];
    }
    return id;
};
exports.nanoidV2 = nanoidV2;
