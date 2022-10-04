import "dotenv/config";

import { checkENVs, getInterval, ProvidersEnabled } from "./utils";

import TMobile from "./providerModels/TMobile";
import KPN from "./providerModels/KPN";

const providersEnabled: ProvidersEnabled = checkENVs();
console.log(providersEnabled);
const interval: number = getInterval();
let KPN_counter = 6; // every 6 TMobile (5mins * 6 = 30 mins)

const run = async () => {
  if (providersEnabled.KPN && KPN_counter == 6) {
    const kpn = new KPN();
    await kpn.run();
    KPN_counter = 0;
  }
  if (providersEnabled.TMobile) {
    const tmobile = new TMobile();
    const MBsLeft = await tmobile.run();
  }
  KPN_counter += 1;
};
run();
setInterval(() => {
  run();
}, interval);
