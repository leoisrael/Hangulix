const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

function compileTemplate(template) {
  let code = "let r=[]; const print=(...args)=>r.push(...args);\nwith(data){\n";
  let cursor = 0;
  const regex = /<%([-=]?)([\s\S]+?)%>/g;
  const addText = (text) => {
    if (!text) return;
    code +=
      "r.push('" +
      text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\r/g, "")
        .replace(/\n/g, "\\n") +
      "');\n";
  };

  let match;
  while ((match = regex.exec(template))) {
    addText(template.slice(cursor, match.index));
    const indicator = match[1];
    const snippet = match[2];
    if (indicator === '=' || indicator === '-') {
      code += `r.push(${snippet});\n`;
    } else {
      code += `${snippet}\n`;
    }
    cursor = match.index + match[0].length;
  }

  addText(template.slice(cursor));
  code += '}\nreturn r.join("");';
  return new Function('data', code);
}

function renderEjs(filePath, data = {}) {
  const template = fs.readFileSync(filePath, 'utf8');
  const renderer = compileTemplate(template);
  return renderer(data);
}

function getContentType(ext) {
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
  };
  return map[ext] || 'text/plain';
}

const consonantsBasic = [
  { symbol: 'ㄱ', romanization: 'g/k' },
  { symbol: 'ㄴ', romanization: 'n' },
  { symbol: 'ㄷ', romanization: 'd/t' },
  { symbol: 'ㄹ', romanization: 'r/l' },
  { symbol: 'ㅁ', romanization: 'm' },
  { symbol: 'ㅂ', romanization: 'b/p' },
  { symbol: 'ㅅ', romanization: 's' },
  { symbol: 'ㅇ', romanization: 'ng/silent' },
  { symbol: 'ㅈ', romanization: 'j' },
  { symbol: 'ㅊ', romanization: 'ch' },
  { symbol: 'ㅋ', romanization: 'k' },
  { symbol: 'ㅌ', romanization: 't' },
  { symbol: 'ㅍ', romanization: 'p' },
  { symbol: 'ㅎ', romanization: 'h' },
];

const consonantsDouble = [
  { symbol: 'ㄲ', romanization: 'kk' },
  { symbol: 'ㄸ', romanization: 'tt' },
  { symbol: 'ㅃ', romanization: 'pp' },
  { symbol: 'ㅆ', romanization: 'ss' },
  { symbol: 'ㅉ', romanization: 'jj' },
];

const vowelsSimple = [
  { symbol: 'ㅏ', romanization: 'a' },
  { symbol: 'ㅑ', romanization: 'ya' },
  { symbol: 'ㅓ', romanization: 'eo' },
  { symbol: 'ㅕ', romanization: 'yeo' },
  { symbol: 'ㅗ', romanization: 'o' },
  { symbol: 'ㅛ', romanization: 'yo' },
  { symbol: 'ㅜ', romanization: 'u' },
  { symbol: 'ㅠ', romanization: 'yu' },
  { symbol: 'ㅡ', romanization: 'eu' },
  { symbol: 'ㅣ', romanization: 'i' },
];

const vowelsDiphthongs = [
  { symbol: 'ㅐ', romanization: 'ae' },
  { symbol: 'ㅔ', romanization: 'e' },
  { symbol: 'ㅒ', romanization: 'yae' },
  { symbol: 'ㅖ', romanization: 'ye' },
  { symbol: 'ㅘ', romanization: 'wa' },
  { symbol: 'ㅙ', romanization: 'wae' },
  { symbol: 'ㅚ', romanization: 'oe' },
  { symbol: 'ㅝ', romanization: 'wo' },
  { symbol: 'ㅞ', romanization: 'we' },
  { symbol: 'ㅟ', romanization: 'wi' },
  { symbol: 'ㅢ', romanization: 'ui' },
];

const practiceSet = [
  { symbol: '가', romanization: 'ga', hint: 'ㄱ + ㅏ' },
  { symbol: '나', romanization: 'na', hint: 'ㄴ + ㅏ' },
  { symbol: '다', romanization: 'da', hint: 'ㄷ + ㅏ' },
  { symbol: '라', romanization: 'ra/la', hint: 'ㄹ + ㅏ' },
  { symbol: '마', romanization: 'ma', hint: 'ㅁ + ㅏ' },
  { symbol: '바', romanization: 'ba', hint: 'ㅂ + ㅏ' },
  { symbol: '사', romanization: 'sa', hint: 'ㅅ + ㅏ' },
  { symbol: '자', romanization: 'ja', hint: 'ㅈ + ㅏ' },
  { symbol: '차', romanization: 'cha', hint: 'ㅊ + ㅏ' },
  { symbol: '카', romanization: 'ka', hint: 'ㅋ + ㅏ' },
  { symbol: '타', romanization: 'ta', hint: 'ㅌ + ㅏ' },
  { symbol: '파', romanization: 'pa', hint: 'ㅍ + ㅏ' },
  { symbol: '하', romanization: 'ha', hint: 'ㅎ + ㅏ' },
  { symbol: '개', romanization: 'gae', hint: 'ㄱ + ㅐ' },
  { symbol: '겨', romanization: 'gyeo', hint: 'ㄱ + ㅕ' },
  { symbol: '뇨', romanization: 'nyo', hint: 'ㄴ + ㅛ' },
  { symbol: '류', romanization: 'ryu/lyu', hint: 'ㄹ + ㅠ' },
  { symbol: '뱌', romanization: 'bya', hint: 'ㅂ + ㅑ' },
  { symbol: '숭', romanization: 'sung', hint: 'ㅅ + ㅜ + ㅇ' },
  { symbol: '징', romanization: 'jing', hint: 'ㅈ + ㅣ + ㅇ' },
];

const sections = [
  { title: 'Consoantes básicas', items: consonantsBasic },
  { title: 'Consoantes duplas', items: consonantsDouble },
  { title: 'Vogais simples', items: vowelsSimple },
  { title: 'Vogais complexas', items: vowelsDiphthongs },
];

function serveStatic(req, res) {
  const urlPath = decodeURI(req.url.split('?')[0]);
  if (!urlPath.startsWith('/public/')) return false;
  const filePath = path.join(__dirname, urlPath);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return true;
  }
  if (!fs.existsSync(normalized) || fs.statSync(normalized).isDirectory()) {
    res.writeHead(404);
    res.end('Not Found');
    return true;
  }
  const contentType = getContentType(path.extname(normalized));
  const content = fs.readFileSync(normalized);
  res.writeHead(200, { 'Content-Type': contentType });
  if (req.method === 'HEAD') {
    res.end();
  } else {
    res.end(content);
  }
  return true;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  if (serveStatic(req, res)) return;

  if (req.url === '/' || req.url.startsWith('/?')) {
    const html = renderEjs(path.join(__dirname, 'views', 'index.ejs'), {
      sections,
      practiceSet,
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(html);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Hangulix pronto na porta ${PORT}`);
});
