import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
import Address from "./address.entity";

@Entity()
class Progress {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  checked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity()
class Product {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  productId!: string;

  @Column()
  price!: string;

  @Column()
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity()
class Coupon {
  @Column()
  id!: string;

  @Column()
  email!: string;

  @Column()
  discount!: number;

  @Column()
  description!: string;

  @Column()
  userId!: string;

  @Column()
  expiresIn!: Date;

  @Column()
  code!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("orders")
export default class Order extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  totalPrice!: string;

  @Column()
  orderId!: string;

  @Column()
  status!: string;

  @Column()
  paymentMethod!: string;

  @Column()
  deliveryMethod!: string;

  @Column()
  address!: Address;

  @Column()
  pickup!: string;

  @Column()
  products!: Product[];

  @Column()
  trackingId!: string;

  @Column()
  paymentId!: string;

  @Column()
  progress!: Progress[];

  @Column()
  shippingFee!: string;

  @Column()
  coupon!: Coupon;

  @Column()
  phoneNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
