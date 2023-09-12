>> DOES NOT WORK!!!! I might update when someone proposes a fix on the Tweakers thread, however I do not use T-Mobile myself so it has 0 prio for me.

>> Update (2023-12-09): Someone proposed a [solution](https://gathering.tweakers.net/forum/list_message/76494790#76494790), I have yet to test this etc but will definetly have a look soon<sup>tm</sup>
>> Update (2023-12-09 v2): Uuuh awkward, apparently my friend doesn't have tmobile/odido unlimited anymore so can't use his credentials to test. Since I have Vodafone myself it's impossible for me to develop.

> Based on: https://gathering.tweakers.net/forum/view_message/69930184

# T-Mobile Unlimited GO Auto Bundle Requester

### Without needing to sniff your URL every month.
It runs every 5 mins (can be set with ENV variable `UPDATE_INTERVAL`), and requests new bundle when MB's is less than 2000.
Firstly a login token is retrieved via the "regular" log in URL, from which a Bearer token is retrieved.
With the Bearer token the regular API is used to request: current bundles, how much is left on these bundles and then (when needed) a new bundle is requested.
Every request is retried at least 10 times when a request fails.
PM2 is used so it should restart if it crashes.

## Usage (production)
There are 3 main ways to use this software in production:
1. running the Node.js locally
2. running it as a Docker container
3. running it as a Docker container via docker-compose

### Node.js with Yarn/NPM
1. `git clone https://github.com/lodu/TMobile-NL-Unlimited-Bundle-Automated`
2. `yarn` or `npm install`
3.  create a file called `.env` in root folder with contents:
      ```bash
      EMAIL=example@example.com
      PASSWORD=3x4mp1e!
      MSISDN=+3161234567890
      UPDATE_INTERVAL=5
      ```
2.  `yarn build` or `npm run build`
3.  `yarn start-daemon` or `npm run start-daemon`
4. Done


### Docker
1.  create a file called `.env`:
      ```bash
      EMAIL=example@example.com
      PASSWORD=3x4mp1e!
      MSISDN=+3161234567890
      UPDATE_INTERVAL=5
      ```
2. `docker pull ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`
3. `docker run --env-file .env ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`

### docker-compose
1.  create a file called `.env`:
      ```bash
      EMAIL=example@example.com
      PASSWORD=3x4mp1e!
      MSISDN=+3161234567890
      UPDATE_INTERVAL=5
      ```
2. copy [`docker-compose.yaml`](./docker-compose.yaml) to a local `docker-compose.yaml` file
3. `docker-compose up -d`

## Development
1. `git clone` the repo (duhh)
2. Create `.env` file in root directory:
   ```bash
   EMAIL=example@example.com
   PASSWORD=3x4mp1e!
   MSISDN=+3161234567890
   UPDATE_INTERVAL=5
   ```
3. Install packages: `yarn` or `npm install`

4. Run  in development for filewatcher `yarn dev` or `npm run dev`

5. Do ya thing.

## PR's

PR's/MR's are welcomed if you have any additions and or points of improvement

## Issues
Please feel free to open an issue, I'm glad to help.
However do not use it as a tech support please...
