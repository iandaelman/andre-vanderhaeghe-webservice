import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserAccount } from "./useraccount";

@Entity({ name: "painting" })
export class Painting {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 255, nullable: false, unique: true })
  title!: string;
  @Column({ length: 255, nullable: false })
  category!: string;
  @Column()
  description!: string;
  @Column({})
  imagefilepath!: string;
  @Column()
  length!: number;
  @Column()
  height!: number;
  @Column()
  price!: number;
  @ManyToMany(() => UserAccount, (useraccount) => useraccount.paintings)
  useraccounts!: UserAccount[];
}
