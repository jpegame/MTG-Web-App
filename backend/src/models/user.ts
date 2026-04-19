import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcrypt";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  password!: string;

  //  Hash password before saving
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  
  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}