import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
  ObjectId
} from "typeorm";
import { Level } from "../../../typing";


@Entity("invites")
export default class Invite extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  email!: string;

  @Column()
  level!: Level;

  @Column()
  status!: string;

  @Column()
  inviteCode!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
