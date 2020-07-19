#!/usr/bin/sh
watchmode=0
while test $# -gt 0; do
  case "$1" in
    --watch)
      shift
      
      export watchmode=1
      ;;
    *)
      break
      ;;      
  esac
done

render()
{
    node renderMarkdown.js ~/workspace/werckmeister/manual.md src/app/components/pages
}

while [ $watchmode -eq 1 ]
do
    inotifywait -m -q -e modify ~/workspace/werckmeister/manual.md | date +"%D %T" && render
done
render
