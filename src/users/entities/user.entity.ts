import { Province } from 'src/provinces/entities/province.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  state!: string;

  @ManyToOne(() => Province, (province) => province.users, { nullable: true })
  @JoinColumn({ name: 'provinceid' })
  province!: Province;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
