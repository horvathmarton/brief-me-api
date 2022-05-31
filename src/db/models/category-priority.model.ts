import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.model';
import { User } from './user.model';

@Entity()
@Exclude()
export class CategoryPriority {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'user__id' })
  @Expose()
  public userId: number;

  @Column({ name: 'category__id' })
  @Expose()
  public categoryId: number;

  @Column({ name: 'priority', type: 'int', nullable: false })
  @Expose()
  public priority: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user__id' })
  public user: User;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn({ name: 'category__id' })
  public category: Category;
}
