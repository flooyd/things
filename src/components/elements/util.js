import { v4 as uuidv4 } from "uuid";

export const getId = (tag) => {
  return tag + "-" + uuidv4();
};
