docker build . -t registry.deti/egs-fuellink/auth-getusers
docker push registry.deti/egs-fuellink/auth-getusers
kubectl delete -f getusers-deployment.yaml
kubectl apply -f getusers-deployment.yaml
