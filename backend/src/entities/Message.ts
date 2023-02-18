import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './User';

@Entity()
export class Message {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne({ entity: () => User, onDelete: 'cascade' })
  sender: User;

  @Property()
  message: string;

  @Property()
  time: string;

  @Property()
  roomId: string;

  constructor({ sender, message, time, roomId }: CreateMessageDTO) {
    this.sender = sender;
    this.message = message;
    this.time = time;
    this.roomId = roomId;
  }
}

export type CreateMessageDTO = {
  sender: User;
  message: string;
  time: string;
  roomId: string;
};
