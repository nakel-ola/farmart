import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
import { Level } from "../../../typing";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

@Entity("users")
export default class User extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  photoUrl!: string | null;

  @Column()
  password!: string;

  @Column({ nullable: true, type: "enum", enum: Gender })
  gender!: Gender | null;

  @Column({ nullable: true })
  birthday!: string | null;

  @Column({ nullable: true })
  phoneNumber!: string | null;

  @Column({ default: true })
  blocked!: boolean;

  @Column({ nullable: true })
  level!: Level;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
