import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Click } from './clicks.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  code: string;

  @Column('text')
  url: string;

  @Column({ nullable: true })
  usuarioId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deleted: Date;

  @OneToMany(() => Click, (click) => click.url)
  clicks: Click[]
}
