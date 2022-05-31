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
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'name', type: 'text', nullable: false, unique: true })
  public name: string;

  @TreeParent()
  public parent: Category;

  @TreeChildren()
  public children: Category[];

  @CreateDateColumn()
  public createdAt: Date;
}
