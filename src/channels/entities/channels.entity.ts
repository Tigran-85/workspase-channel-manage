import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Workspace } from '../../workspaces/entities/workspaces.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @ManyToOne(() => User, (user) => user.channels)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.channels)
  workspace: Workspace;
}
