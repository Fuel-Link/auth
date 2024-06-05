const key = require("./keycloak.json");
const getusers = require("./getusers");

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
  res.json(await getusers.getusers());
})

app.listen(3000, function () {
  console.log('App listening on port 3000');
});
