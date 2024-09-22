import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Workspace } from '../../workspaces/entities/workspaces.entity';
import {Channel} from "../../channels/entities/channels.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  profileImage: string;

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];

  @OneToMany(() => Channel, (channel) => channel.user)
  channels: Channel[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  toJSON() {
    const { password, ...result } = this;
    return result;
  }

  // Helper method to compare passwords
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
