import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity('resume_history')
export class ResumeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  fileId: string;

  @Column()
  action: string; // upload, process, extract, delete

  @Column()
  status: string; // success, failed, pending

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.resumeHistory)
  user: User;

  @ManyToOne(() => File, (file) => file.resumeHistory)
  @JoinColumn()
  file: File;
}
