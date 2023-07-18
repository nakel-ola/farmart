import { redis } from "../context";
import redisGet from "./redisGet";

const redisKeys = async (key: string, newKey: string) => {
  const keys = await redisGet<string[]>(key);

  if (!keys) return await redis.set(key, JSON.stringify([newKey]));

  const newKeys = [...keys, newKey];

  const seen = new Set<string>();

  const results = newKeys.filter((el) => {
    const duplicate = seen.has(el);
    seen.add(el);
    return !duplicate;
  });

  return await redis.set(key, JSON.stringify([results]));
};
export default redisKeys;
