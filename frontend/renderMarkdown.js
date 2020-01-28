// Create reference instance
const marked = require('marked');
var fs = require('fs');


const filePath = process.argv[2]

if (!filePath) {
    console.log("missing input file");
    process.exit(-1);
}

const inText = fs.readFileSync(filePath).toString();

const renderer = new marked.Renderer();

renderer.code = code => `<pre><code><![CDATA[\n${code}\n]]></code></pre>`;
renderer.codespan = code => "<code>" + code
    .replace(/{/g, '{{')
    .replace(/}/g, '}}') + "</code>";

// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
  renderer: renderer,
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

// Compile
const outText = marked(inText);
console.log(outText);