> Based on: https://gathering.tweakers.net/forum/view_message/69930184

> If you end up using this, please [contact me](mailto:unlimited-sim-automation@lodu.dev) so I can improve this software.
# T-Mobile Unlimited GO Auto Bundle Requester

### Without needing to sniff your URL every month.
It runs every 5 mins, and requests new bundle when MB's is less than 2000.
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
      ```
2.  `yarn build` or `npm run build`
3.  `yarn start-demon` or `npm run start-demon`
4. Done


### Docker
1.  create a file called `.env`:
      ```bash
      EMAIL=example@example.com
      PASSWORD=3x4mp1e!
      MSISDN=+3161234567890
      ```
2. `docker pull ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`
3. `docker run --env-file .env ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`

### docker-compose
1.  create a file called `.env`:
      ```bash
      EMAIL=example@example.com
      PASSWORD=3x4mp1e!
      MSISDN=+3161234567890
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
   ```
3. Install packages: `yarn` or `npm install`

4. Run  in development for filewatcher `yarn dev` or `npm run dev`

5. Do ya thing.


## Future

Im looking into adding KPN and Vodafone via some magical way, not sure how.

## PR's

PR's/MR's are welcomed if you have any additions and or points of improvement

## Issues
Please feel free to open an issue, I'm glad to help.
However do not use it as a tech support please...
