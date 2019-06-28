#!/bin/bash
lineschanged=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep "UGWFrontend/" | wc -l)
echo $lineschanged
if [ $lineschanged == "0" ]
    then
        echo "No changes, skipping tests"
    else
        npm ci
        if [ $TRAVIS_EVENT_TYPE == "push" && $TRAVIS_BRANCH == "master" ] 
            then
                npm version patch
            else
                if [ $TRAVIS_EVENT_TYPE == "push" && $TRAVIS_BRANCH == "release" ] 
                then
                    npm version minor
                fi
        fi
        ng build --prod
        npm run test
        npm run e2e
        bash <(curl -s https://codecov.io/bash) -t $(echo "$UPLOAD_TOKEN")
fi

