import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "painting" })
export class Painting {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: false, unique: true })
  title: string;
  @Column({ length: 255, nullable: false })
  category: string;
  @Column()
  description: string;
  @Column({})
  imageFilepath: string;
  @Column()
  length: number;
  @Column()
  height: number;
  @Column()
  price: number;
  @ManyToMany(() => User, (user) => user.paintings)
  users: User[];
}
