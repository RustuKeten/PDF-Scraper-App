import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { File } from './file.entity';
import { ResumeData } from './resume-data.entity';
import { ResumeHistory } from './resume-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  emailVerified: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 1000 })
  credits: number;

  @Column({ default: 'FREE' })
  planType: string;

  @Column({ nullable: true })
  subscriptionId: string;

  @OneToMany(() => File, (file) => file.user)
  files?: File[];

  @OneToMany(() => ResumeData, (resumeData) => resumeData.user)
  resumeData?: ResumeData[];

  @OneToMany(() => ResumeHistory, (history) => history.user)
  resumeHistory?: ResumeHistory[];
}
