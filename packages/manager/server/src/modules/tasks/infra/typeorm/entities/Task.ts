import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instrument: string;

  @Column('time with time zone')
  date: Date;

  @Column()
  status: string;

  @Column()
  task: string;

  @Column()
  details: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
