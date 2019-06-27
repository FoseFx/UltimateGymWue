#!/bin/bash
lineschanged=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep "UGWFrontend/" | wc -l)
echo $lineschanged
if [ $lineschanged == "0" ]
    then
        echo "No changes, skipping tests"
    else
        npm ci
        ng build --prod
        npm run test
        npm run e2e
        if [ $TRAVIS_EVENT_TYPE == "pull_request" ]
          then
            echo "PR, no codecov commit"
          else
            bash <(curl -s https://codecov.io/bash) -t $(echo "$UPLOAD_TOKEN")
        fi
fi

