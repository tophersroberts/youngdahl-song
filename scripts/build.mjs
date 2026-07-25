import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const output = join(root, 'dist');
const source = join(root, 'Copy of As The Brush Goes English Translation, pt 1.md');
const aboutSource = join(root, 'content', 'about.md');
const basePath = process.env.BASE_PATH
  ? `/${process.env.BASE_PATH.replace(/^\/+|\/+$/g, '')}/`
  : '/';
const route = (path = '') => `${basePath}${path.replace(/^\//, '')}`;

if (!existsSync(source)) {
  throw new Error('Translation source not found. Place the Markdown manuscript in the project root.');
}

rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, 'as-the-brush-goes'), { recursive: true });

const markdown = readFileSync(source, 'utf8');
const titlePattern = /^# (.+?)\s*$/;
const lines = markdown.split(/\r?\n/);
const entries = [];
let current = null;

for (let index = 0; index < lines.length; index += 1) {
  const match = lines[index].match(titlePattern);
  if (match) {
    const title = match[1].trim().replace(/\\([*_])/g, '$1');
    current = { title, lines: [] };
    entries.push(current);
    continue;
  }
  if (!current) continue;
  // The source repeats each title before its bold heading; omit that duplicate.
  if (current.lines.length === 0 && lines[index].trim() === current.title) continue;
  current.lines.push(lines[index]);
}

const slugify = (text) => text.toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reading';
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (text) => escape(text.trimEnd())
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/---/g, '—')
  .replace(/'/g, '’');
const render = (entry) => entry.lines.join('\n').trim().split(/\n\s*\n/)
  .filter(Boolean)
  .map((block) => `<p>${block.split('\n').map(inline).join('<br>')}</p>`).join('\n');
const renderPageMarkdown = (sourceText) => sourceText.trim().split(/\n\s*\n/).map((block) => {
  const heading = block.match(/^# (.+)$/);
  return heading ? `<h1>${inline(heading[1])}</h1>` : `<p>${block.split('\n').map(inline).join('<br>')}</p>`;
}).join('\n');
const slugs = new Map();
for (const entry of entries) {
  const base = slugify(entry.title);
  const count = (slugs.get(base) || 0) + 1;
  slugs.set(base, count);
  entry.slug = count === 1 ? base : `${base}-${count}`;
}

const styles = `
:root{--paper:#f8f4eb;--ink:#292720;--muted:#6b675c;--green:#506454;--line:#d9d1c1;--serif:Georgia,'Times New Roman',serif;--sans:ui-sans-serif,system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--serif);font-size:19px;line-height:1.75}a{color:inherit;text-decoration-color:#9aa494;text-underline-offset:4px}.wrap{width:min(100% - 3rem,72rem);margin:auto}header{border-bottom:1px solid var(--line);padding:1.25rem 0;font-family:var(--sans);font-size:.82rem;letter-spacing:.08em;text-transform:uppercase}header .wrap{display:flex;justify-content:space-between;gap:1rem;align-items:center}nav{display:flex;gap:1.2rem}.brand{text-decoration:none;font-weight:650}main{padding:clamp(3.5rem,8vw,7rem) 0}h1,h2,h3{font-weight:400;line-height:1.15}h1{font-size:clamp(2.8rem,7vw,5.5rem);letter-spacing:-.045em;margin:0 0 1.25rem}h2{font-size:1.8rem}.eyebrow{font:600 .75rem/1.4 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--green)}.intro{font-size:clamp(1.3rem,2.4vw,1.65rem);max-width:37rem}.button{display:inline-block;background:var(--green);color:#fff;text-decoration:none;padding:.75rem 1.1rem;font:600 .8rem var(--sans);letter-spacing:.07em;text-transform:uppercase}.rule{border:0;border-top:1px solid var(--line);margin:4rem 0}.book-grid{display:grid;grid-template-columns:minmax(0,1fr) 16rem;gap:4rem}.toc{font-family:var(--sans);font-size:.95rem}.toc ol{padding-left:1.3rem}.toc li{padding:.38rem 0}.poem{max-width:38rem}.poem h1{font-size:clamp(2.5rem,5vw,4.3rem);margin-bottom:3rem}.poem p{margin:0 0 1.5rem}.poem-nav{display:flex;justify-content:space-between;align-items:center;gap:1rem;border-top:1px solid var(--line);margin-top:4rem;padding-top:1.5rem;font-family:var(--sans);font-size:.9rem}.toc-return{border:1px solid var(--line);border-radius:999px;padding:.4rem .75rem;text-decoration:none;white-space:nowrap}.toc-return:hover,.toc-return:focus-visible{background:#ece6da;outline:none}.note{color:var(--muted);font-size:.9rem;font-family:var(--sans)}footer{border-top:1px solid var(--line);padding:2rem 0 3rem;color:var(--muted);font:.8rem var(--sans)}@media(max-width:700px){body{font-size:18px}.wrap{width:min(100% - 2rem,72rem)}header .wrap{align-items:flex-start;flex-direction:column}.book-grid{grid-template-columns:1fr;gap:2rem}.toc{order:-1}nav{gap:.8rem}.poem-nav{flex-wrap:wrap}.toc-return{order:-1;width:100%;text-align:center}}`;
const layout = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="The writing and collection of Young-Dahl Song."><title>${escape(title)} · Young-Dahl Song</title><style>${styles}</style></head><body><header><div class="wrap"><a class="brand" href="${route()}">Young-Dahl Song</a><nav><a href="${route('about/')}">About</a><a href="${route('as-the-brush-goes/')}">As The Brush Goes</a></nav></div></header><main class="wrap">${body}</main><footer><div class="wrap">Young-Dahl Song Archive · A careful work in progress.</div></footer></body></html>`;
const write = (file, page) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, page); };
const toc = `<ol>${entries.map((entry) => `<li><a href="${route(`as-the-brush-goes/${entry.slug}/`)}">${inline(entry.title)}</a></li>`).join('')}</ol>`;

write(join(output, 'index.html'), layout('Home', `<p class="eyebrow">Writing · Memory · Collection</p><h1>As The Brush Goes</h1><p class="intro">The writing and collected world of Young-Dahl Song: educator, writer, and lifelong observer of lives in motion.</p><p><a class="button" href="${route('as-the-brush-goes/')}">Read the translation</a></p><hr class="rule"><h2>A living archive</h2><p>This is a home for Young-Dahl Song’s work, beginning with the English translation of <em>As The Brush Goes</em>. His writing, collected artworks, and life story will continue to gather here.</p>`));
write(join(output, 'about', 'index.html'), layout('About', `<p class="eyebrow">About</p>${renderPageMarkdown(readFileSync(aboutSource, 'utf8'))}`));
const preface = entries.shift();
write(join(output, 'as-the-brush-goes', 'index.html'), layout('As The Brush Goes', `<div class="book-grid"><section><p class="eyebrow">English translation · Part one</p><h1>As The Brush Goes</h1><p class="intro">A collection of thoughts and feelings, written down “just as the brush flowed.”</p><p><a class="button" href="${route(`as-the-brush-goes/${preface.slug}/`)}">Begin with the preface</a></p><p class="note">This digital edition is generated from a Markdown manuscript of the original Korean collection by Young-Dahl Song, translated to English by Frances Smyth.</p></section><aside class="toc"><p class="eyebrow">Contents</p>${toc}</aside></div>`));
entries.unshift(preface);
for (const [index, entry] of entries.entries()) {
  const previous = entries[index - 1]; const next = entries[index + 1];
  const navigation = `<nav class="poem-nav">${previous ? `<a href="${route(`as-the-brush-goes/${previous.slug}/`)}">← ${inline(previous.title)}</a>` : '<span></span>'}<a class="toc-return" href="${route('as-the-brush-goes/')}">Table of contents</a>${next ? `<a href="${route(`as-the-brush-goes/${next.slug}/`)}">${inline(next.title)} →</a>` : '<span></span>'}</nav>`;
  write(join(output, 'as-the-brush-goes', entry.slug, 'index.html'), layout(entry.title, `<article class="poem"><p class="eyebrow">As The Brush Goes · ${index === 0 ? 'Preface' : `Reading ${index}`}</p><h1>${inline(entry.title)}</h1>${render(entry)}${navigation}</article>`));
}
console.log(`Built ${entries.length} readings from the Markdown manuscript.`);
