# RUN LIKE THIS: ./k8s-first-deploy <MAIL_JET_USER> <MAIL_JET_KEY> <INSTA_CID> <INSTA_SECRET>
echo "MAIL_JET_USER: " $1
echo "MAIL_JET_KEY: " $2
echo "INSTA_CID: " $3
echo "INSTA_SECRET: " $4
SEC=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 60 ; echo '')
echo "SECRET (generated): " $SEC
# kubectl create namespace ugw
kubectl create secret generic regcred --namespace=ugw --from-file=.dockerconfigjson=$HOME/.docker/config.json --type=kubernetes.io/dockerconfigjson
# kubectl create secret generic ugw-secret --namespace=ugw --from-literal=secret=$SEC --from-literal=mju=$1 --from-literal=mjk=$2 --from-literal=icid=$3 --from-literal=is=$4
./k8s-deploy.sh