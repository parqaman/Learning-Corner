import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class Document {
    @PrimaryKey()
  id: string = v4();

  @Property()
  data: object;

  constructor(data: object) {
    this.data = data;
  }
}