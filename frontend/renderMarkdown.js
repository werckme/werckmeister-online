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
const marked = require('marked');
const _ = require('lodash');
var fs = require('fs');
const splitFilesByH1 = true;
const fileSplitSeq = '$FILE-SPLIT';
const fileNames = [];
const filePath = process.argv[2]
const outputDir = process.argv[3]
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

renderer.code = (code, language) => {
  let languageData = getLanguageMetaDataOrDefault(language);
  if (languageData && languageData.language) {
    const codeObj = createCodeObj(code, languageData); 
    return `<tutorialsnippet lineHeight="${codeObj.lineHeight}" lineOffset="${codeObj.lineOffset}"><pre><code appWerckmeisterCode><![CDATA[${codeObj.code}]]></code></pre></tutorialsnippet>`;
  }
  return `<pre><code><![CDATA[\n${code}\n]]></code></pre>`;
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