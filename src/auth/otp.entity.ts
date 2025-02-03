import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'otp' })
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => User, (user) => user.Otp)
  user: User;

  @Column()
  userId: number;
}
