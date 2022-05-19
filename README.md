> Based on: https://gathering.tweakers.net/forum/view_message/69930184

# T-Mobile Unlimited GO Auto Bundle Requester

### Without needing to sniff your URL every month.

## How to use

1. `git clone` the repo (duhh)
2. Create `.env` file in root directory:
   ```bash
   EMAIL=example@example.com
   PASSWORD=3x4mp1e!
   MSISDN=+3161234567890
   ```
3. Start software via one of 3 options explained below:
   - Yarn/NPM
   - Docker
   - docker-compose

#### Yarn/NPM

1.  `yarn` or `npm`
2.  `yarn build` or `npm run build`
3.  `yarn start-demon` or `npm run start-demon`

#### Docker

1. `docker build . -t unlimited-sim-automation`
2. `docker run --env-file .env unlimited-sim-automation`

#### docker-compose

1. `docker-compose up -d`

## Future

Im looking into adding KPN and Vodafone via some magical way, not sure how.

## PR's

PR's/MR's are welcomed if you have any additions and or points of improvement
