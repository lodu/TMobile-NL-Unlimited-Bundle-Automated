// TODO: fix error handling

import {
  AvailableBundle,
  Bundle,
  Subscription,
  SubscriptionsResource,
} from "./interfaces";
import fetch, { Headers } from "node-fetch";
import { fetchURI, makeHeaders } from "../../utils";

// https://nodejs.org/en/blog/release/v18.0.0/ implements fetch, but it's not LTS

export default class TMobile {
  private API_URI: string;
  private PERSONAL_API_URI: string;
  private TMOBILE_MSISDN: string; // +3161234567890
  private DEFAULT_HEADERS: object = {
    "User-Agent": "ODIDO 8.0.0 (Android 12; 12)",
  };
  private DEFAULT_AUTH_TOKEN_HEADERS: object = {
    Authorization: `Basic OWhhdnZhdDZobTBiOTYyaTo=`, // Can be used by anyone
    "Content-Type": "application/json",
  };
  private BearerAuthorizationCode: string;
  private subscriptionURL: string;
  private buyingCode: string;

  constructor(BASE_URI: string = "https://capi.odido.nl") {
    this.API_URI = BASE_URI;
    this.TMOBILE_MSISDN = process.env.MSISDN;
    this.BearerAuthorizationCode = process.env.AUTHORIZATIONTOKEN
  }


  private async getSubscriptionsResource(): Promise<SubscriptionsResource> {
    let subscriptionsResource: SubscriptionsResource = null;

    const URI: string = `${this.API_URI}/account/current?resourcelabel=LinkedSubscriptions`;
    const headers: Headers = makeHeaders(
      Object.assign(this.DEFAULT_HEADERS, {
        Authorization: `Bearer ${this.BearerAuthorizationCode}`,
        Accept: "application/json",
      })
    );

    const callback = async (response: Response) => {
      subscriptionsResource = await response.json();
      if (subscriptionsResource != null) return true;
      return false;
    };

    await fetchURI(
      URI,
      "GET",
      headers,
      "getSubscriptionsResource",
      undefined,
      callback
    );
    return subscriptionsResource;
  }

  private async handleSubscriptionURL(): Promise<string> {
    let subscriptionURL: string;
    const subscriptionsResource: SubscriptionsResource =
      await this.getSubscriptionsResource();

    const URI: string = subscriptionsResource.Resources[0].Url;

    const headers: Headers = makeHeaders(
      Object.assign(this.DEFAULT_HEADERS, {
        Authorization: `Bearer ${this.BearerAuthorizationCode}`,
        Accept: "application/json",
      })
    );

    const callback = async (response: Response) => {
      const jsonResponse = await response.json();
      let subscriptions: Subscription[] = jsonResponse.subscriptions; // but why does it ignore my Interface?
      for (let subscription of subscriptions) {
        // TODO make this not make me go "eeewwwww"
        if (subscription.MSISDN == this.TMOBILE_MSISDN) {
          this.PERSONAL_API_URI = subscription.SubscriptionURL;
          subscriptionURL = `${this.PERSONAL_API_URI}/roamingbundles`;
        }
      }

      if (subscriptionURL != undefined) return true;
      return false;
    };

    await fetchURI(
      URI,
      "GET",
      headers,
      "handleSubscriptionURL",
      undefined,
      callback
    );
    this.subscriptionURL = subscriptionURL;
    return subscriptionURL;
  }

  public async getMBsLeft(): Promise<number> {
    let buyingCodeTemp: string;
    let bundles: Bundle[];
    const subscriptionURL: string =
      this.subscriptionURL != undefined
        ? this.subscriptionURL
        : await this.handleSubscriptionURL();
    const headers: Headers = makeHeaders(
      Object.assign(this.DEFAULT_HEADERS, {
        Authorization: `Bearer ${this.BearerAuthorizationCode}`,
        Accept: "application/json",
      })
    );

    const callback = async (response: Response) => {
      const jsonResponse = await response.json();
      bundles = jsonResponse.Bundles; // Bruh i really need to learn to apply an interface to api response
      if (bundles != undefined) return true;
      return false;
    };

    await fetchURI(
      subscriptionURL,
      "GET",
      headers,
      "getMBsLeft",
      undefined,
      callback
    );

    let MBsLeft: number = 0;
    for (let bundle of bundles) {
      if (bundle.ZoneColor == "NL") {
        MBsLeft += bundle.Remaining.Value / 1024;
        // if (bundle.BuyingCode != undefined) buyingCodeTemp = bundle.BuyingCode; DOESN'T WORK ANYMORE, REPLACED BY SETTING BUYINGCODE 'A0DAY01'
      }
    }
    // this.buyingCode = buyingCodeTemp;
    this.buyingCode = 'A0DAY01';
    return Math.floor(MBsLeft);
  }

  public async requestBundle() {
    if (this.buyingCode == undefined) await this.getMBsLeft();
    const URI: string =
      this.subscriptionURL != undefined
        ? this.subscriptionURL
        : await this.handleSubscriptionURL();

    const headers: Headers = makeHeaders(
      Object.assign(this.DEFAULT_HEADERS, {
        Authorization: `Bearer ${this.BearerAuthorizationCode}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      })
    );
    const body: string = JSON.stringify({
      Bundles: [{ BuyingCode: this.buyingCode }],
    });

    const callback = async (response: Response) => {
      const res = response;
      if (
        res.status != 202 &&
        res.statusText ==
          "The provided buying code isn't available for purchase."
      ) {
        console.log("Cannot already get new bundle");
      } else if (res.status == 202 && res.statusText == "Accepted") {
        console.log("New bundle has been added");
      } else {
        return false;
      }
      return true;
    };

    await fetchURI(URI, "POST", headers, "requestBundle", body, callback);
  }
}
