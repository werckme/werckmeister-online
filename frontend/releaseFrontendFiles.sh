#!/bin/sh
target=$1
cdir=$(pwd)
if [ -z $target ]
then
    echo "missing target directory"
    exit 1
fi
ng build --configuration production
cd $target
rm *.js *css -f
rsync -a $cdir/dist/spa/ .


mkdir -p werckmeister && cp index.html werckmeister/
mkdir -p manual && cp index.html manual/
mkdir -p getting-started && cp index.html getting-started/
mkdir -p examples && cp index.html examples/
mkdir -p code-extension && cp index.html code-extension/
mkdir -p getwerckmeister && cp index.html getwerckmeister/
mkdir -p editor && cp index.html editor/
mkdir -p creator && cp index.html creator/
cd $cdir
