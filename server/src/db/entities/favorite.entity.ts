import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity("favorites")
export default class Favorite extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: string;

  @Column({ array: true })
  data!: string[];
}
