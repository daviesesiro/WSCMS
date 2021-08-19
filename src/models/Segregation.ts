import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Segregation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  tankName: string;

  @Column()
  lastSegregated: Date;

  @Column()
  segregationDate: Date;

  @Column()
  fishAge: number; //in months

  @CreateDateColumn()
  createdDate: Date;
}
