docker build . -t registry.deti/egs-fuellink/auth-pump
docker push registry.deti/egs-fuellink/auth-pump
kubectl delete -f pump-deployment.yaml
kubectl apply -f pump-deployment.yaml
