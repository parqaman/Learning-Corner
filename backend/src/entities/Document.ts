import {
  Entity,
  Property,
  Unique,
} from "@mikro-orm/core";

@Entity()
export class Document {
  @Property()
  @Unique()
  id: string;

  @Property()
  data: string;

  constructor(id: string, data: string) {
    this.id = id;
    this.data = data;
  }
}
