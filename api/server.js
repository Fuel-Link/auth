const session = require('express-session');
const memoryStore = new session.MemoryStore();

const Keycloak = require('keycloak-connect');
const keycloak = new Keycloak({ store: memoryStore });

const express = require('express');
const app = express();
app.use(
  session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  })
);
app.use(keycloak.middleware());

app.get('/', (req, res) => {
  res.json({message: 'home'});
})

app.get('/public', (req, res) => {
    res.json({message: 'public'});
  });
  
  app.get('/secured', keycloak.protect('realm:user'), (req, res) => {
    res.json({message: 'secured'});
  });
  
  app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
    res.json({message: 'admin'});
  });

  app.get('/any', keycloak.protect(), (req, res) => {
    res.json({message: 'any'});
  })

  app.get('/login', keycloak.protect(), (req, res) => {
    res.json({message: 'success'});
  })

  app.get('/logout', (req, res) => {
    res.redirect(keycloak.logoutUrl);
  })

  app.get('/directly', (req, res) => {
    keycloak.protect();
  })
  
  app.use('*', (req, res) => {
    res.json({message: 'error'});
  });

app.listen(3000, function () {
    console.log('App listening on port 3000');
});
