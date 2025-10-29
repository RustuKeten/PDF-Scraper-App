import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ResumeData } from './resume-data.entity';
import { ResumeHistory } from './resume-history.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column({ default: 'application/pdf' })
  fileType: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column()
  userId: string;

  @Column({ nullable: true })
  storagePath: string;

  @Column({ default: 'uploaded' })
  status: string; // uploaded, processing, completed, failed

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @OneToOne(() => ResumeData, (resumeData) => resumeData.file, {
    nullable: true,
  })
  resumeData?: ResumeData;

  @OneToMany(() => ResumeHistory, (history) => history.file)
  resumeHistory?: ResumeHistory[];
}
