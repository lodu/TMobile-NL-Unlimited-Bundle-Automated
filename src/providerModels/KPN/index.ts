// https://mijn.kpn.com/api/v5/?method=kpn.subscription.change&sc_service_token=w14K9v10
import fetch, { Headers } from "node-fetch";
import FormData from "form-data";
import { fetchURI, makeHeaders } from "../../utils";
import { remote } from "webdriverio";

export const func = async () => {
  const browser = await remote({
    capabilities: {
      browserName: "chrome",
      chromeOptions: {
        args: ["headless", "disable-gpu"],
      },
    },
  });

  await browser.url("https://webdriver.io");

  const apiLink = await browser.$("=API");
  await apiLink.click();

  await browser.saveScreenshot("./screenshot.png");
  await browser.deleteSession();
};
