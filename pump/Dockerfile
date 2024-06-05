FROM node:22-alpine
WORKDIR /app
COPY ./package.json ./package.json
RUN npm install
COPY ./keycloak.json ./keycloak.json
COPY ./index.js ./index.js
COPY ./index.html ./index.html
COPY ./config.js ./config.js
COPY ./logo.svg ./logo.svg
ENTRYPOINT [ "npm", "run", "start" ]
