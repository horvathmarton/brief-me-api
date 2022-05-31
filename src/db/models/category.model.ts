import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  TreeParent,
  TreeChildren,
  Tree,
} from 'typeorm';

@Tree('materialized-path')
@Exclude()
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'name', type: 'text', nullable: false, unique: true })
  @Expose()
  public name: string;

  @TreeParent()
  public parent: Category;

  @TreeChildren()
  @Expose()
  public children: Category[];

  @CreateDateColumn()
  public createdAt: Date;
}
