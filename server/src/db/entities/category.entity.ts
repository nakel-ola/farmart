import { BaseEntity, Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("categories")
export default class Category extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;
}
