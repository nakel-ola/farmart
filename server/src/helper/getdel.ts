import { redis } from "../context";
import arrayMerge from "./arrayMerge";

const getdel = async (keys: string[]) => {
  let newKeys: string[] = [];
  for (let i = 0; i < keys.length; i++) {
    const list = await redis.keys(keys[i]);
    newKeys = arrayMerge(newKeys, list);
  }

  if (newKeys.length > 0) await redis.del(newKeys);
};
export default getdel;
