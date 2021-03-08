#!/bin/sh
rm -rf dist
ng build --prod && cd dist/spa && scp -r * sambag@euporie.uberspace.de:/home/sambag/html/werckmeister-frontend-dev