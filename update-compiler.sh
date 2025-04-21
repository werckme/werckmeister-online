#!/bin/bash
cwd=$(pwd)
componentDir=../werckmeister-component
compiler_pkg=@werckmeister/compilerjs
component_pkg=@werckmeister/components

cd $componentDir
msg=$(npm show --json $compiler_pkg | grep -Eo '"latest": .*')
npm install "$compiler_pkg@latest"
git commit -am "update $compiler_pkg to $msg"
git push
cd $cwd

while true; do
    read -p "is publish done? >" isdone
    if [[ "$isdone" == "yes" ]]; then
        break
    else
        echo "answer yes."
    fi
done

cd frontend
npm install $component_pkg@latest


