import DataLoader from "dataloader";
import type { Address } from "../../typing";
import { db } from "../context";

const addressLoader = new DataLoader<string, Address, string>(async (keys) => {
  const results: Address[] = await db.addresses.find({ _id: { $in: keys } });
  return keys.map(
    (key) =>
      results.find((r) => r.id === key) || new Error(`No result for ${key}`)
  );
});

export default addressLoader;
