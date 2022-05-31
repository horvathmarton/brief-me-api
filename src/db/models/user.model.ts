import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'username', type: 'text', nullable: false, unique: true })
  public username: string;

  @Column({ name: 'full_name', type: 'text', nullable: false })
  public fullName: string;

  @Column({ name: 'password_hash', type: 'text', nullable: false })
  public passwordHash: string;

  @Column({
    name: 'is_admin',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public isAdmin: boolean;

  @CreateDateColumn()
  public createdAt: Date;
}
