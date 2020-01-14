import { install } from "./install";

install(8, { type: "jre" })
.then((dir: any) => console.log(dir))
.catch((err: any) => {
  console.log(err);
});