#!/bin/sh
rm -rf dist
npx ng build --configuration production && cd dist/spa && scp -r * sambag@euporie.uberspace.de:/home/sambag/html/werckmeister-frontend-dev