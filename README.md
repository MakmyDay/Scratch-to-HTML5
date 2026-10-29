const state = {
  mode: 'html-to-scratch',
};

const sourceInput = document.getElementById('sourceInput');
const output = document.getElementById('output');
const sourceLabel = document.getElementById('sourceLabel');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const sampleBtn = document.getElementById('sampleBtn');
const downloadBtn = document.getElementById('downloadBtn');
const modeButtons = document.querySelectorAll('.mode-button');

const SAMPLE_HTML = `
  <main class="demo-app">
    <h1>Hello from HTML</h1>
    <button type="button">Click me</button>
    <p>Turn this into a Scratch-style project.</p>
  </main>
`;

const SAMPLE_SCRATCH = {
  projectName: 'Demo Scratch Project',
  version: '1.0',
  sprites: [
    {
      name: 'Stage',
      isStage: true,
      variables: {},
      lists: {},
      costumes: [{ name: 'Backdrop', assetId: 'backdrop-1', md5ext: 'backdrop-1.svg', dataFormat: 'svg', bitmapResolution: 1, rotationCenterX: 0, rotationCenterY: 0 }],
      sounds: [],
      blocks: {}
    },
    {
      name: 'Title',
      isStage: false,
      variables: {},
      lists: {},
      costumes: [{ name: 'Title costume', assetId: 'title-1', md5ext: 'title-1.svg', dataFormat: 'svg', bitmapResolution: 1, rotationCenterX: 0, rotationCenterY: 0 }],
      sounds: [],
      html: {
        tag: 'h1',
        text: 'Hello from Scratch',
        attributes: { class: 'scratch-title' }
      }
    },
    {
      name: 'Button',
      isStage: false,
      variables: {},
      lists: {},
      costumes: [{ name: 'Button costume', assetId: 'button-1', md5ext: 'button-1.svg', dataFormat: 'svg', bitmapResolution: 1, rotationCenterX: 0, rotationCenterY: 0 }],
      sounds: [],
      html: {
        tag: 'button',
        text: 'Click me',
        attributes: { type: 'button', class: 'scratch-button' }
      }
    }
  ],
  htmlMap: [
    { element: 'h1', text: 'Hello from Scratch' },
    { element: 'button', text: 'Click me' }
  ]
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function safeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function collectAttributes(node) {
  const attrs = {};
  for (const attribute of node.attributes) {
    if (attribute.value) {
      attrs[attribute.name] = attribute.value;
    }
  }
  return attrs;
}

function createCostume(name) {
  return {
    name,
    assetId: slugify(name) + '-' + Math.random().toString(16).slice(2, 8),
    md5ext: `${slugify(name)}.svg`,
    dataFormat: 'svg',
    bitmapResolution: 1,
    rotationCenterX: 0,
    rotationCenterY: 0,
  };
}

function htmlToScratch(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText || '<div>Empty HTML</div>', 'text/html');
  const body = doc.body || doc.documentElement;
  const elements = Array.from(body.children).filter((node) => {
    return node.tagName && !['SCRIPT', 'STYLE'].includes(node.tagName.toUpperCase());
  });

  const sprites = [{
    name: 'Stage',
    isStage: true,
    variables: {},
    lists: {},
    costumes: [createCostume('Backdrop')],
    sounds: [],
    blocks: {},
  }];

  const htmlMap = [];

  if (!elements.length) {
    const fallbackText = safeText(htmlText) || 'Empty HTML';
    sprites.push({
      name: 'Text-1',
      isStage: false,
      variables: {},
      lists: {},
      costumes: [createCostume('Text Costume')],
      sounds: [],
      blocks: {},
      html: {
        tag: 'div',
        text: fallbackText,
        attributes: { class: 'converted-text' },
      },
    });

    htmlMap.push({ element: 'div', text: fallbackText });
  } else {
    elements.forEach((element, index) => {
      const safeName = `${element.tagName.toLowerCase()}-${index + 1}`;
      const text = safeText(element.textContent) || element.tagName.toLowerCase();
      const attributes = collectAttributes(element);

      sprites.push({
        name: safeName,
        isStage: false,
        variables: {},
        lists: {},
        costumes: [createCostume(safeName)],
        sounds: [],
        blocks: {},
        html: {
          tag: element.tagName.toLowerCase(),
          text,
          attributes,
        },
      });

      htmlMap.push({ element: element.tagName.toLowerCase(), text, attributes });
    });
  }

  return JSON.stringify({
    projectName: 'HTML to Scratch Conversion',
    version: '1.0',
    sprites,
    htmlMap,
  }, null, 2);
}

function scratchToHtml(scractchText) {
  let project;

  try {
    project = JSON.parse(scractchText);
  } catch (error) {
    return 'The input must be valid JSON. Please paste a Scratch-style project JSON or use the sample data.';
  }

  const sprites = Array.isArray(project.sprites) ? project.sprites : [];
  const htmlNodes = sprites
    .filter((sprite) => !sprite.isStage)
    .map((sprite, index) => {
      const tag = sprite.html && sprite.html.tag ? sprite.html.tag : 'div';
      const text = (sprite.html && sprite.html.text) || `Sprite ${index + 1}`;
      const attributes = (sprite.html && sprite.html.attributes) || {};
      const attributeString = Object.entries(attributes)
        .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
        .join('');

      return `<${tag}${attributeString} class="scratch-sprite">${escapeHtml(text)}</${tag}>`;
    });

  if (!htmlNodes.length) {
    htmlNodes.push('<div class="scratch-sprite">Converted Scratch element</div>');
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Converted Scratch Project</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #020817, #0f172a);
        font-family: Arial, sans-serif;
        color: #f8fafc;
      }

      .scratch-scene {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }

      .scratch-sprite {
        display: inline-block;
        padding: 10px 16px;
        border-radius: 12px;
        background: rgba(56, 189, 248, 0.15);
        border: 1px solid rgba(56, 189, 248, 0.28);
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
      }

      button.scratch-sprite {
        border: none;
        cursor: pointer;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #052e16;
      }
    </style>
  </head>
  <body>
    <main class="scratch-scene">
      ${htmlNodes.join('\n      ')}
    </main>
  </body>
</html>`;
}

function updateMode(mode) {
  state.mode = mode;
  modeButtons.forEach((button) => {
    const isSelected = button.dataset.mode === mode;
    button.classList.toggle('active', isSelected);
  });

  if (mode === 'html-to-scratch') {
    sourceLabel.textContent = 'HTML input';
    sourceInput.value = SAMPLE_HTML.trim();
    output.value = htmlToScratch(sourceInput.value);
  } else {
    sourceLabel.textContent = 'Scratch JSON input';
    sourceInput.value = JSON.stringify(SAMPLE_SCRATCH, null, 2);
    output.value = scratchToHtml(sourceInput.value);
  }
}

function convertCurrent() {
  if (state.mode === 'html-to-scratch') {
    output.value = htmlToScratch(sourceInput.value);
  } else {
    output.value = scratchToHtml(sourceInput.value);
  }
}

function copyOutput() {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = 'Copied';
    setTimeout(() => {
      copyBtn.textContent = 'Copy output';
    }, 1200);
  }).catch(() => {
    copyBtn.textContent = 'Copy failed';
    setTimeout(() => {
      copyBtn.textContent = 'Copy output';
    }, 1200);
  });
}

function downloadOutput() {
  if (!output.value) return;

  const extension = state.mode === 'html-to-scratch' ? 'json' : 'html';
  const blob = new Blob([output.value], { type: extension === 'json' ? 'application/json' : 'text/html' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `converted-output.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => updateMode(button.dataset.mode));
});

convertBtn.addEventListener('click', convertCurrent);
copyBtn.addEventListener('click', copyOutput);
downloadBtn.addEventListener('click', downloadOutput);
sampleBtn.addEventListener('click', () => {
  if (state.mode === 'html-to-scratch') {
    sourceInput.value = SAMPLE_HTML.trim();
    output.value = htmlToScratch(sourceInput.value);
  } else {
    sourceInput.value = JSON.stringify(SAMPLE_SCRATCH, null, 2);
    output.value = scratchToHtml(sourceInput.value);
  }
});

sourceInput.addEventListener('input', () => {
  if (!sourceInput.value.trim()) {
    output.value = '';
    return;
  }

  convertCurrent();
});

updateMode('html-to-scratch');

window.addEventListener('DOMContentLoaded', () => {
  sourceInput.value = SAMPLE_HTML.trim();
  output.value = htmlToScratch(sourceInput.value);
});

















































































































































































































