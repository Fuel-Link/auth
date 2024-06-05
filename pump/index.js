const config = require('./config');
const key = require("./keycloak.json");

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'pump',
  brokers: ['kafka:29092'],
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/logo.svg', (req, res) => {
  res.sendFile(path.join(__dirname, '/logo.svg'));
})

app.post('/grantAuthorization', async (req, res) => {

  let myHeaders, urlencoded, response, requestOptions;

  //
  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_id", key.resource);
  urlencoded.append("username", req.body.username);
  urlencoded.append("password", req.body.password);
  urlencoded.append("scope", "openid profile email roles");

  requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  try {
    response = await fetch(key['auth-server-url'] + "/realms/Fuel-Link/protocol/openid-connect/token", requestOptions)
    result = await response.json();
  }
  catch {
    res.json('login failed');
    return
  }

  //
  myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + result.access_token);

  urlencoded = new URLSearchParams();
  urlencoded.append("client_id", key.resource);
  urlencoded.append("token", req.body.token);

  requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  try {
    response = await fetch(key['auth-server-url'] + "/realms/Fuel-Link/protocol/openid-connect/userinfo", requestOptions);
    result = await response.json();
  }
  catch {
    res.json('user list failed');
    return
  }

  const producer = kafka.producer();
  await producer.connect();
  await producer.send(
    {
      topic: 'gas-pump_auth',
      messages: [
        { 
          key: 'data',
          value: '{"username": "'+result.preferred_username+'", "hash": "'+result.sub+'"}',
        }
      ],
    }
  );
  await producer.disconnect();
  
  console.log(result.sub)
  console.log(result.preferred_username)
  res.json('success');
});

app.listen(3000, function () {
  console.log('App listening on port 3000');
});
