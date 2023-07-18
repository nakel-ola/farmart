import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("reviews")
export default class Review extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  productId!: string;

  @Column()
  name!: string;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column()
  rating!: number;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
