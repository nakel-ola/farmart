import DataLoader from "dataloader";
import { ObjectId } from "mongodb";
import type { ProductType } from "../../typing";
import { db } from "../db/entities";

const productLoader = new DataLoader<string, ProductType, string>(
  async (keys) => {
    const results = await db.products.find({
      where: { _id: { $in: keys.map((key) => new ObjectId(key)) } },
    });

    return keys
      .map(
        (key) =>
          results.find((r) => r.id.toString() === key.toString()) ?? false
      )
      .filter(Boolean) as any;
  }
);

export default productLoader;
