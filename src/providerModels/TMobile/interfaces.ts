export interface Resource {
  Label: string;
  Url: string;
  Availability: string;
}

export interface SubscriptionsResource {
  Username: string;
  Type: string;
  Brand: string;
  Resources: Resource[];
}

export interface Subscription {
  MSISDN: string;
  SubscriptionURL: string;
}

export interface Bundle {
  ZoneColor: string;
  BuyingCode: string;
  Remaining: {
    Value: number;
  };
}
export interface AvailableBundle {
  BuyingCode: string;
  Naam: string;
}

// Unused
export interface Headers {
  "User-Agent": string;
  Authorization?: string;
  "Content-Type"?: string;
  Accept?: string;
  "Accept-Encoding?": string;
}
