FROM node:lts-alpine as build

WORKDIR /app
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json
COPY yarn.lock ./yarn.lock
RUN yarn
COPY ./src ./src
RUN yarn build

FROM node:lts-alpine

WORKDIR /app
COPY package.json ./package.json
RUN yarn install
COPY --from=build /app/dist ./dist

CMD yarn start-daemon