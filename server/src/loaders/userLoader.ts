import DataLoader from "dataloader";
import type { User } from "../../typing";
import { db, userSelect } from "../context";

const userLoader = new DataLoader<string, User, string>(async (keys) => {
  const results: User[] = await db.users.find(
    { _id: { $in: keys } },
    userSelect
  );
  return keys.map(
    (key) =>
      results.find((r) => r.id === key) || new Error(`No result for ${key}`)
  );
});

export default userLoader;
