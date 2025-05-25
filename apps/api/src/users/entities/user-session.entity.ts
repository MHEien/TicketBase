import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_sessions')
export class UserSession {
  @ApiProperty({ description: 'Unique identifier for the session' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the user who owns this session' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'JWT token for the session' })
  @Column()
  token: string;

  @ApiProperty({ description: 'Refresh token for the session' })
  @Column()
  refreshToken: string;

  @ApiProperty({ description: 'Device information' })
  @Column({ nullable: true })
  device: string;

  @ApiProperty({ description: 'IP address' })
  @Column({ nullable: true })
  ip: string;

  @ApiProperty({ description: 'Location information' })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ description: 'When the session was last active' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @ApiProperty({ description: 'When the session was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the session expires' })
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({ description: 'Whether the session has been revoked' })
  @Column({ default: false })
  isRevoked: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;
}
