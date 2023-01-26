import {
  Entity,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

@Entity()
export class Document {
  @PrimaryKey()
  id: string;

  @Property()
  data: object;

  constructor(id: string, data: object) {
    this.id = id;
    this.data = data;
  }
}
