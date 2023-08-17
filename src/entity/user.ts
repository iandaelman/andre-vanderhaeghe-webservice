import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Painting } from "./painting";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToMany(() => Painting, (painting) => painting.users)
  @JoinTable({ name: "users_paintings" })
  paintings: Painting[];

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  auth0Id: string;
}
