docker build . -t registry.deti/egs-fuellink/keycloak
docker push registry.deti/egs-fuellink/keycloak
kubectl delete -f keycloak-deployment.yaml
kubectl apply -f keycloak-deployment.yaml
