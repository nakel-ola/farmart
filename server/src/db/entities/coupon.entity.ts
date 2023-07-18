import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("coupons")
export default class Coupon extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  email!: string;

  @Column()
  code!: string;

  @Column()
  discount!: number;

  @Column()
  description!: string;

  @Column()
  userId!: string;
  
  @Column()
  expiresIn!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
