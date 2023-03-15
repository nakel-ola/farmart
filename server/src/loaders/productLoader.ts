import DataLoader from "dataloader";
import type { Product } from "../../typing";
import { db } from "../context";

const productLoader = new DataLoader<string, Product, string>(async (keys) => {
  const results: Product[] = await db.products.find({ _id: { $in: keys } });
  return keys
    .map((key) => results.find((r) => r.id === key) ?? false)
    .filter(Boolean) as Product[];
});

export default productLoader;
