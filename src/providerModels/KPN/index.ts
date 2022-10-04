import puppeteer, { Browser, Page, TimeoutError } from "puppeteer";

import {delay} from "../../utils"

export default class KPN {
  private BASE_URL: string;
  private page: Page;

  constructor(BASE_URL: string = "https://mijn.kpn.com") {
    this.BASE_URL = BASE_URL;
  }

  private async getBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1280, height: 720 },
    });
    return browser;
  }

  private async awaitAndClick(selector: string) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  private async checkElementPresent(selector: string): Promise<Boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch (e) {
      if (e instanceof TimeoutError) {
        return false;
      } else throw new Error(e);
    }
  }

  private async login() {
    await this.page.type("#email", process.env.KPN_EMAIL);
    await this.page.type("#password", process.env.KPN_PASSWORD);
    await this.page.click(".button.is-primary.is-full-width");
    await delay(5000);
  }

  private async handlePossibleCookieWall(){
    const cookieWallExists: Boolean = await this.checkElementPresent(
      "#onetrust-accept-btn-handler"
    );
    if (cookieWallExists)
      await this.awaitAndClick("#onetrust-accept-btn-handler");
    await delay(3000);
  }
  public async run() {
    try{
      const browser: Browser = await this.getBrowser();
      this.page = await browser.newPage();
      this.page.goto(this.BASE_URL);
      await this.page.waitForSelector("#email");
      await this.handlePossibleCookieWall()
      
      await this.login();

      await this.page.goto(`${this.BASE_URL}/#/producten`);

      await this.awaitAndClick(`.mobiel_06-${process.env.KPN_NUMBER.slice(4)}`);

      await this.awaitAndClick(".extra_bundles_quick_link");
      await delay(10000);

      // from here on: https://github.com/leolabs/kpn-unlimited
      await this.awaitAndClick(
        "#kpn-subscription div.panel-body > ul > li:nth-child(1)"
      );
      await this.awaitAndClick(
        "#kpn-subscription roaming-bundle-assistent > div:nth-child(1) > div.margin-top-double > div > div"
      );
      await this.page.waitForSelector("#agree");
      await this.page.evaluate(() => {
        document?.querySelector("#agree")?.parentElement?.click();
      });
      const priceField = await this.page.$(
        "#kpn-subscription .panel-body > div > div > div:nth-child(1) > .col-xs-4.col-lg-3.text-right > p"
      );
      if (!priceField) {
        throw new Error("No price field detected.");
      }

      const price = await this.page.evaluate((e) => e.textContent, priceField);

      if (String(price).trim() !== "€ 0,00") {
        throw new Error("Price isn't free (" + price + ")");
      }

      await delay(3000);
      await this.awaitAndClick("#btn-confirm:not(.disabled)");
      const bundleRequestSucces: Boolean = await this.checkElementPresent(".alert.alert-success");
      if (bundleRequestSucces) console.log("KPN: Succesfully added bundle!")

      await this.page.screenshot({
        fullPage: true,
        path: "loggin_" + Date.now() + ".png",
      });
  } catch(e){
    await this.page.screenshot({
      fullPage: true,
      path: "error_" + Date.now() + ".png",
    });
  }
}
}
