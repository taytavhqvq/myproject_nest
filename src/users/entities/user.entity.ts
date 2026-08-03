import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userid!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  state!: string;
}
