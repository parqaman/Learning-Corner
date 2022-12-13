import { Options } from "@mikro-orm/core";
import { User } from "./entities/User";

const options: Options = {
  type: "postgresql",
  entities: [User],
  dbName: "learning-corner",
  password: "fwe_lc",
  user: "lcUser",
  debug: true,
  host: "localhost"
};

export default options;
