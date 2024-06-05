FROM node:22-alpine
WORKDIR /app
COPY ./package.json ./package.json
RUN npm install
COPY ./keycloak.json ./keycloak.json
COPY ./index.js ./index.js
COPY ./getusers.js ./getusers.js
ENTRYPOINT [ "node", "index.js" ]
