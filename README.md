# Authentication service for Fuel Link

To deploy Keycloak and PostgresSQL, run:

```bash
docker compose up -d
```

If the **volumes** folder is present, Keycloak should already be configured. The credentials to access the admin dashboard (localhost:8080) are **admin:admin**.

Both username/password and GitHub authentication are enabled when using Keycloak to protect an endpoint. By default, every new user is assigner the **user** role.

Keycloak expects the API to be running on localhost:3000, but this can be changed in the dashboard if needed.

The file **server.js** is an exemple implementation of the **keycloak-connect** library, used to protect an **express.js** API.

After initializing the API with the Keycloak middleware configured, the function **keycloak.protect()** should be used to protect endpoints. If the function has no arguments, the endpoint will only return if the user is logged in. If the function has an argument such as **keycloak.protect("realm:admin")**, the endpoint will only return if the logged in user has the role **admin**. 