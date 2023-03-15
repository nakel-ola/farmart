import type { HydratedDocument } from "mongoose";

const toJson = (data: HydratedDocument<any | any[]>) => {
  if (typeof data === "object") return data.toJson();

  if (Array.isArray(data)) return data.map((data) => data.toJson());
};
export default toJson;
