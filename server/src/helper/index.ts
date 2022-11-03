import { randomFillSync } from "crypto";
import { urlAlphabet } from "./url-alphabet";

const POOL_SIZE_MULTIPLIER = 128;
let pool, poolOffset;

let fillPool = (bytes) => {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    randomFillSync(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    randomFillSync(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
};
let random = (bytes) => {
  fillPool((bytes -= 0));
  return pool.subarray(poolOffset - bytes, poolOffset);
};

let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size = defaultSize) => {
    let id = "";

    while (true) {
      let bytes = getRandom(step);
      let i = step;

      while (i--) {
        id += alphabet[bytes[i] & mask] || "";
        if (id.length === size) return id;
      }
    }
  };
};

let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random);

let nanoid = (size = 21) => {
  fillPool((size -= 0));
  let id = "";

  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
};

let nanoidV2 = (alphabet: string, size = 21,length: number = 63) => {
  fillPool((size -= 0));
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += alphabet[pool[i] & length];
  }
  return id;
};

export { urlAlphabet, nanoid, customAlphabet, customRandom, random, nanoidV2 };
