import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import TaskAlert from '@modules/tasks/infra/typeorm/entities/TaskAlert';

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instrument: string;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  status: string;

  @Column()
  task: string;

  @Column()
  details: string;

  @OneToMany(() => TaskAlert, taskAlert => taskAlert.task, { cascade: true })
  alerts: TaskAlert[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'alerts' })
  getAlerts(): TaskAlert[] {
    if (!this.alerts) return [];

    return this.alerts;
  }
}
