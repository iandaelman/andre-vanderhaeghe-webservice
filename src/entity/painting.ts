import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Category } from "./category";

@Entity({ name: "painting" })
export class Painting {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: false, unique: true })
  title: string;
  @ManyToOne(() => Category, (category) => category.paintings)
  category: Category;
  @Column()
  description: string;
  @Column({})
  imageFilepath: string;
  @Column()
  price: number;
  @ManyToMany(() => User, (user) => user.paintings)
  users: User[];
}
