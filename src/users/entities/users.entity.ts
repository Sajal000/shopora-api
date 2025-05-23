import { Exclude } from 'class-transformer';
import { Otp } from 'src/auth/entities/otp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 96, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 96, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 96, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string;

  @Column({ default: false, nullable: false })
  verified: boolean;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @Column({ type: 'varchar', length: 96, nullable: true })
  addressId: string | null;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  userPosts: string[];

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  userTags: string[];
}
