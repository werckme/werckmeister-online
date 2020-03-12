const singleTemplate = { 
  code:
`tempo: $tempo;
device: MyDevice  midi 1;
instrumentDef:ex1  MyDevice  0 0 0;
[
instrument: ex1;
{


$code


}
]`
, lineOffset: 7
};
const MdCodeWerckmeisterTypeSingle = 'single';
const MdCodeWerckmeisterTypeMute = 'mute';
const marked = require('marked');
const _ = require('lodash');
var fs = require('fs');
const splitFilesByH1 = true;
const fileSplitSeq = '$FILE-SPLIT';
const fileNames = [];
const filePath = process.argv[2]
const outputDir = process.argv[3]
const anchorPixelOffset = 66;

if (!filePath) {
    console.log("missing input file");
    process.exit(-1);
}

if (!outputDir && splitFilesByH1) {
  console.log("missing output directory");
  process.exit(-1);
}

function normalizeFileName(text) {
  return text
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
}

function getLanguageMetaDataOrDefault(languageString) {
  if (!languageString) {
    return null;
  }
  let values = _(languageString.split(/\s*,\s*/))
    .map(x=>x.split(/\s*=\s*/))
    .fromPairs()
    .value();
  if (values.length === 1) {
    return languageString;
  }
  return values;
}

function getLineHeight(code) {
  const lines = _(code).countBy(x => x === '\n').value().true;
  return lines || 1;
}

function createCodeObj(code, languageData) {
  let lineHeight = getLineHeight(code);
  let lineOffset = 0;
  if (languageData.type === MdCodeWerckmeisterTypeSingle) {
    const tempo = languageData.tempo || 120;
    code = singleTemplate.code.replace('$code', code)
      .replace('$tempo', tempo);
    lineOffset = singleTemplate.lineOffset;
    lineHeight = Math.max(lineHeight, 2);
  }
  return {lineHeight, lineOffset, code};
}

const inText = fs.readFileSync(filePath).toString();

const renderer = new marked.Renderer();
const superHeading = renderer.heading.bind(renderer);
const superCode = renderer.code.bind(renderer);
const superTable = renderer.table.bind(renderer);
const superLink = renderer.link.bind(renderer);

renderer.link = (href, title, text) => {
  if (href.indexOf('#')<0) {
    return superLink(href, title, text);
  }
  var seg = href.split('#');
  href = !!seg[0] ? `/${seg[0]}` : "./";
  var frag = seg[1] 
  return `<a pageScroll [pageScrollDuration]="0" [pageScrollOffset]="${anchorPixelOffset}" [routerLink]="['${href}']" fragment="${frag}">${text}</a>`
}

renderer.heading = (string, level, raw, slugger) => {
  let result = superHeading(string, level, raw, slugger);
  if (level === 1 && splitFilesByH1) {
    result = `${fileSplitSeq}
${result}
`;
    fileNames.push(normalizeFileName(string));    
  }
  return result;
};

renderer.table = (header, body) => {
  const result = superTable(header, body);
  return result
    .replace("<table>", '<table class="table table-bordered">');
}

renderer.code = (code, language, isEscaped) => {
  let languageData = getLanguageMetaDataOrDefault(language);
  if (languageData && languageData.language && languageData.type != MdCodeWerckmeisterTypeMute) {
    const codeObj = createCodeObj(code, languageData); 
    return `<tutorialsnippet lineHeight="${codeObj.lineHeight}" lineOffset="${codeObj.lineOffset}"><pre><code appWerckmeisterCode><![CDATA[${codeObj.code}]]></code></pre></tutorialsnippet>`;
  }
  const cdata = `![CDATA[${code}]]`;
  return `<pre><code><${cdata}></code></pre>`;
}
renderer.codespan = (code) => { 
  return "<code>" + code
    .replace(/{/g, '{{')
    .replace(/}/g, '}}') + "</code>";
};

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
if (!splitFilesByH1) {
  console.log(outText);
  process.exit(0);
}

files = outText.split(fileSplitSeq).filter(x => x.length !== 0);

for (let idx = 0; idx < files.length; ++idx) {
  const content = files[idx];
  const fileName = fileNames[idx] + '.html';
  // console.log(fileName);
  // console.log(content);
  fs.writeFileSync(`${outputDir}/${fileName}`, content);
}
