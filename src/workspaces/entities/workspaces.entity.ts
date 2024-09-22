import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Channel } from '../../channels/entities/channels.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: false, unique: true })
  uniqueSlag: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  user: User;

  @OneToMany(() => Channel, (channel) => channel.workspace)
  channels: Channel[];
}
