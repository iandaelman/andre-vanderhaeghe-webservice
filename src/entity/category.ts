import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Painting } from "./painting";

@Entity({ name: "category" })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: false, unique: true })
  name: string;
  @OneToMany(() => Painting, (painting) => painting.category)
  paintings: Painting[];
}
