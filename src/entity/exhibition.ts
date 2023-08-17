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
  startDate: Date;
  @Column({ type: "date" })
  endDate: Date;
}
