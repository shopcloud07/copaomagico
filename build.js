const fs = require('fs');

// Fonte do corpo: o index.html atual (o bloco de rastreamento do fim e removido e
// recriado, entao rodar este build varias vezes seguidas da sempre o mesmo resultado).
let html = fs.readFileSync('index.html', 'utf8');
let css  = fs.readFileSync('styles.css', 'utf8');

const DIMS = {
  "B-01.webp": [
    744,
    495
  ],
  "B-02.webp": [
    744,
    495
  ],
  "B-03.webp": [
    744,
    496
  ],
  "B-04.webp": [
    744,
    496
  ],
  "CAR 01.webp": [
    744,
    744
  ],
  "CAR 02.webp": [
    744,
    744
  ],
  "CAR 03.webp": [
    744,
    744
  ],
  "CAR 04.webp": [
    744,
    744
  ],
  "CAR 05.webp": [
    744,
    744
  ],
  "CAR 06.webp": [
    744,
    744
  ],
  "MOCKUP.webp": [
    598,
    598
  ]
};

// --- os 3 snippets de rastreamento, verbatim como o usuario forneceu ---
const FIM = '</' + 'script>';
const snippets = fs.readFileSync('tracking-snippets.js', 'utf8').trim().split(/\n\s*\n/);
const RASTREIO_HEAD = [
  '  <script>' + snippets[0].trim() + FIM,
  '  <script>' + snippets[1].trim() + FIM,
  '  <script type="text/javascript">\n' + snippets[2].trim().split('\n').map(l => '    ' + l.trim()).join('\n') + '\n  ' + FIM
].join('\n\n');

let body = html.match(/<body>([\s\S]*)<\/body>/)[1];
// remove qualquer bloco de rastreamento adiado deixado por uma build anterior
const marcador = body.indexOf('<script>');
if (marcador !== -1 && body.slice(marcador).includes('carregarRastreamento')) {
  body = body.slice(0, marcador).replace(/\s*$/, '\n\n');
}

// width/height em toda <img> (idempotente)
body = body.replace(/<img\s+src="([^"]+)"(\s+width="\d+"\s+height="\d+")?/g, (m, src) => {
  const d = DIMS[src];
  return d ? `<img src="${src}" width="${d[0]}" height="${d[1]}"` : m;
});

body = body.replace(/preload="metadata"/g, 'preload="none"');

// --- CSS: garante height auto onde a proporcao vem dos atributos ---
if (!css.includes('.bonus-card img {\n  width: 100%;\n  height: auto;'))
  css = css.replace('.bonus-card img {\n  width: 100%;', '.bonus-card img {\n  width: 100%;\n  height: auto;');
if (!css.includes('.produto-img {\n  width: 100%;\n  height: auto;'))
  css = css.replace('.produto-img {\n  width: 100%;', '.produto-img {\n  width: 100%;\n  height: auto;');

const fontes = `@font-face {
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  font-display: optional;
  src: url(fonts/bebasneue-latin.woff2) format('woff2');
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 100 900;
  font-display: optional;
  src: url(fonts/montserrat-latin.woff2) format('woff2');
}

`;

const out = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>200 receitas gourmet de copão</title>

  <link rel="preconnect" href="https://cdn.utmify.com.br">
  <link rel="preconnect" href="https://www.clarity.ms">

${RASTREIO_HEAD}

  <link rel="preload" as="font" type="font/woff2" href="fonts/bebasneue-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="fonts/montserrat-latin.woff2" crossorigin>

  <style>
${fontes}${css.trim()}
  </style>

  <script defer src="script.js"></script>
</head>

<body>${body}</body>
</html>
`;

fs.writeFileSync('index.html', out);
console.log('index.html: ' + (out.length/1024).toFixed(1) + ' KB');
console.log('imagens com dimensoes: ' + (out.match(/<img src="[^"]+" width="\d+" height="\d+"/g)||[]).length);
console.log('rastreamento: imediato na head (3 scripts)');
