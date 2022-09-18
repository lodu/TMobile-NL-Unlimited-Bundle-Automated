import "dotenv/config";

import { checkENVs, getInterval } from "./utils";

import TMobile from "./providerModels/TMobile";

checkENVs();

const run = async () => {
  const tmobile = new TMobile();
  const MBsLeft = await tmobile.getMBsLeft();
  console.log(`${MBsLeft} MB's left`);
  if (MBsLeft < 2000) {
    tmobile.requestBundle();
  }
};
run()
setInterval(() => {
  run();
}, getInterval());
