import { redis } from "../context";

const redisGet = async <T = any>(key: string): Promise<T | null> => {
  // getting cache friend-request from redis if available
  const redisCache = await redis.get(key);

  // checking if redis cache is not available
  if (!redisCache) return null;

  // if redis cache is available
  const parseData: T = JSON.parse(redisCache);
  // return parsed data
  return parseData;
};

export default redisGet;
