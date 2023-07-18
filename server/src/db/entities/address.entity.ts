import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("addresses")
export default class Address extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;
  
  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column()
  street!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  country!: string;

  @Column()
  info!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  phoneNumber2!: string;

  @Column()
  default!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
