import fetch, { Headers, Response } from "node-fetch";

export interface ProvidersEnabled {
  TMobile?: boolean;
  KPN?: boolean;
}

export const interval: number = isNaN(
  parseInt(process.env.UPDATE_INTERVAL || "")
)
  ? 5
  : parseInt(process.env.UPDATE_INTERVAL);

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchURI(
  URI: string,
  method: "GET" | "POST",
  headers: Headers,
  name: string,
  body?: string,
  callback?: Function,
  maxRetries: number = 10
) {
  let success: boolean = false;
  let retries = 0;
  while (!success && maxRetries >= retries) {
    await fetch(URI, {
      method: method,
      headers: headers,
      body: body,
    })
      .then(async (response: Response) => {
        try {
          success = await callback(await response);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`${name}: error during callback: ${error}`);
          } else {
            console.error(
              `${name}: something happened during callback: ${error}`
            );
          }
        }
      })
      .catch(async (error: Error) =>
        console.error(`${name} cannot be retrieved: ${error}`)
      );
    retries += 1;
  }
  if (maxRetries <= 0 && !success) {
    console.error(
      `Something went wrong with al ${
        maxRetries + 1
      } tries for ${name}. Not sure what happened.`
    );
  }
}

export function makeHeaders(headersAsObject: object): Headers {
  let headers: Headers = new Headers();
  for (let header of Object.entries(headersAsObject)) {
    headers.set(header[0], header[1]);
  }
  return headers;
}

export function checkENVs(): ProvidersEnabled {
  let enabledProviders: ProvidersEnabled = { TMobile: false, KPN: false };
  if (
    ![process.env.EMAIL, process.env.PASSWORD, process.env.MSISDN].includes(
      undefined
    )
  ) {
    enabledProviders.TMobile = true;
  }
  if (
    ![
      process.env.KPN_EMAIL,
      process.env.KPN_PASSWORD,
      process.env.KPN_MSISDN,
    ].includes(undefined)
  ) {
    enabledProviders.KPN = true;
  }
  if (Object.values(enabledProviders).every((e) => e == false)) {
    console.error(
      `Neither: ${Object.keys(enabledProviders)} their ENV's are set correct`
    );
    process.exit();
  }
  return enabledProviders;
}

// When ENV-variable is not set return 5
export function getInterval(): number {
  return minsToMs(interval);
}

function minsToMs(minutes: number): number {
  return minutes * 1000 * 60;
}
