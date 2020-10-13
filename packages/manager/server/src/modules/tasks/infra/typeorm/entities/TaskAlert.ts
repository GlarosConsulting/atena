import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Task from '@modules/tasks/infra/typeorm/entities/Task';

@Entity('task_alerts')
export default class TaskAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  task_id: string;

  @Column('uuid')
  user_id: string;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  description: string;

  @ManyToOne(() => Task, task => task.alerts)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
