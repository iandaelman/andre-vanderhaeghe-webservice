import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "exhibition" })
export class Exhibition {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: false, unique: true })
  title: string;
  @Column()
  description: string;
  @Column({ type: "date" })
  startdate: Date;
  @Column({ type: "date" })
  enddate: Date;
}
