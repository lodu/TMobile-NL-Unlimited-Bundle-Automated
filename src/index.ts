import "dotenv/config";

import TMobile from "./providerModels/TMobile";
import { checkENVs, minsToMs } from "./utils";

checkENVs();
import "./providerModels/KPN";
// const run = async () => {
//   const tmobile = new TMobile();
//   const MBsLeft = await tmobile.getMBsLeft();
//   console.log(`${MBsLeft} MB's left`);
//   if (MBsLeft < 2000) {
//     tmobile.requestBundle();
//   }
// };
// setInterval(() => {
//   run();
// }, minsToMs(5));
