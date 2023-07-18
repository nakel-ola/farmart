import DataLoader from "dataloader";
import type { AddressType } from "../../typing";
import { db } from "../db/entities";

const addressLoader = new DataLoader<string, AddressType, string>(
  async (keys) => {
    const results = await db.addresses.find({
      _id: { $in: keys },
    });
    return keys
      .map(
        (key) =>
          results.find((r) => r.id.toString() === key.toString()) ||
          new Error(`No result for ${key}`)
      )
      .map((result) =>
        result
          ? { ...(result as any), id: (result as any).id?.toString() }
          : result
      );
  }
);

export default addressLoader;
