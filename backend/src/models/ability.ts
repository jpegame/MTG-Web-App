import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Ability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  amount?: number;
}
