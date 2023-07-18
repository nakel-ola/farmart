import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
class Rating {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  value!: number;
}

@Entity()
class Currency {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column()
  symbolNative!: string;

  @Column()
  decimalDigits!: number;

  @Column()
  rounding!: number;

  @Column()
  code!: string;

  @Column()
  namePlural!: string;
}

@Entity("products")
export default class Product extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  slug!: string;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column()
  image!: string;

  @Column()
  price!: number;

  @Column()
  stock!: number;

  @Column()
  rating!: Rating[];

  @Column()
  discount!: string;

  @Column()
  currency!: Currency;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
