#!/bin/bash
lineschanged=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep "UGWBackend/src/" | wc -l)
echo $lineschanged
if [ $lineschanged == "0" ]
    then
        echo "No changes, skipping tests"
    else
        cargo test --verbose --all
        echo "$DOCKER_PSW" | docker login -u "$DOCKER_NAME" --password-stdin https://$(echo $DOCKER_REG)
        docker build -t $DOCKER_REG/ugw-backend:0.3.$(echo $TRAVIS_BUILD_NUMBER) .
        docker push $DOCKER_REG/ugw-backend:0.3.$(echo $TRAVIS_BUILD_NUMBER)
        docker tag $DOCKER_REG/ugw-backend:0.3.$(echo $TRAVIS_BUILD_NUMBER) $DOCKER_REG/ugw-backend:latest
        docker push $DOCKER_REG/ugw-backend:latest
fi

echo "done"