import DataLoader from "dataloader";
import type { UserType } from "../../typing";
import { db } from "../db/entities";
import { ObjectId } from "mongodb";

export const userSelect = [
  "birthday",
  "name",
  "email",
  "blocked",
  "createdAt",
  "updatedAt",
  "gender",
  "level",
  "phoneNumber",
  "photoUrl",
  "id",
];

const userLoader = new DataLoader<string, UserType, string>(async (keys) => {
  const results = await db.users.find({
    where: { _id: { $in: keys.map((key) => new ObjectId(key)) } },
    select: userSelect,
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
});

export default userLoader;
