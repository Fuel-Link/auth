const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_id", "api");
  urlencoded.append("client_secret", "n6wf1sybI0YsZcmxNtgVUq66ewPozni1");
  urlencoded.append("username", req.body.username);
  urlencoded.append("password", req.body.password);
  urlencoded.append("scope", "openid profile email roles");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  fetch("http://localhost:8080/realms/Fuel-Link/protocol/openid-connect/token", requestOptions)
    .then((response) => response.json())
    .then((result) => res.json(result))
    .catch((error) => console.error(error));
})

app.post('/refresh', (req, res) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", "api");
  urlencoded.append("client_secret", "n6wf1sybI0YsZcmxNtgVUq66ewPozni1");
  urlencoded.append("scope", "openid profile email roles");
  urlencoded.append("refresh_token", req.body.refresh_token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  fetch("http://localhost:8080/realms/Fuel-Link/protocol/openid-connect/token", requestOptions)
    .then((response) => response.json())
    .then((result) => res.json(result))
    .catch((error) => console.error(error));
})

app.post('/verify', async (req, res) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + req.body.token);

  const urlencoded = new URLSearchParams();

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  const response = await fetch("http://localhost:8080/realms/Fuel-Link/protocol/openid-connect/userinfo", requestOptions);

  try {
    result = await response.json();
    console.log(result);

    sub = result.sub;
    roles = result.realm_access.roles;

    if (roles.includes(req.body.role)) {
      res.json({'permission': true});
    }
    else {
      res.json({'permission': false});
    }
  }
  catch {
    res.json('failed');
  }
})

app.post('/introspect', async (req, res) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + req.body.token);

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "api");
  urlencoded.append("client_secret", "n6wf1sybI0YsZcmxNtgVUq66ewPozni1");
  urlencoded.append("token", req.body.token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  const response = await fetch("http://localhost:8080/realms/Fuel-Link/protocol/openid-connect/token/introspect", requestOptions);

  try {
    result = await response.json();
    console.log(result);
    res.json(result);
  }
  catch {
    res.json('failed');
  }
})

app.listen(4000, function () {
  console.log('App listening on port 4000');
});
