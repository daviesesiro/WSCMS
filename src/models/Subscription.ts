import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

type TSub = {
  endpoint: string;
  expirationTime: any;
  keys: {
    p256dh: string;
    auth: string;
  };
};

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column("json")
  subscription: TSub;

  @Column({ unique: true })
  endpoint: string;

  @CreateDateColumn()
  createdDate: Date;
}
