import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Painting } from "./painting";

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => Painting, (painting) => painting.useraccounts)
  @JoinTable({ name: "useraccounts_paintings" })
  paintings!: Painting[];

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: false })
  password_hash!: string;

  @Column({ nullable: false, type: "json" })
  roles!: string[];
}
