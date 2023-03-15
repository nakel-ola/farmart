import type { Document, Types } from "mongoose";
import clear_id from "./clear_id";

type Hydrated<T = any> = Document<unknown, {}, T> &
  Omit<
    T & {
      _id: Types.ObjectId;
    },
    never
  >;

const formatJson = <T = any>(data: Hydrated | Hydrated[]): T => {

  if (Array.isArray(data)) return clear_id(data.map((d) => d.toJSON()));

  return clear_id(data.toJSON());
};
export default formatJson;
