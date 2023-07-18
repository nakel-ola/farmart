import "reflect-metadata";
import { DataSource } from "typeorm";

const dbDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entities/*.entity.{ts,js}"],
});

export default dbDataSource;
