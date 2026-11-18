'use strict';

// ---------- 小工具 ----------
const $ = (s, r = document) => r.querySelector(s);
const ICON = {
  play: '<path d="M8 4.8v14.4l11-7.2z"/>',
  pause: '<rect x="6.5" y="5" width="3.8" height="14" rx="1"/><rect x="13.7" y="5" width="3.8" height="14" rx="1"/>',
  prev: '<path d="M18 19.5 8.5 12 18 4.5z"/><path d="M5.5 5v14"/>',
  next: '<path d="M6 4.5 15.5 12 6 19.5z"/><path d="M18.5 5v14"/>',
  repeat: '<path d="M17 2.5l4 4-4 4"/><path d="M3 11.5v-1.2a3.8 3.8 0 0 1 3.8-3.8H21"/><path d="M7 21.5l-4-4 4-4"/><path d="M21 12.5v1.2a3.8 3.8 0 0 1-3.8 3.8H3"/>',
  repeat1: '<path d="M17 2.5l4 4-4 4"/><path d="M3 11.5v-1.2a3.8 3.8 0 0 1 3.8-3.8H21"/><path d="M7 21.5l-4-4 4-4"/><path d="M21 12.5v1.2a3.8 3.8 0 0 1-3.8 3.8H3"/><path d="M11 9.8l1.3-.8v6"/>',
  once: '<path d="M4 12h14"/><path d="M13 6l6 6-6 6"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7M10 11v5.5M14 11v5.5"/>',
  folder: '<path d="M3 7.5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
  note: '<path d="M9 18V5.5l11-2V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  lock: '<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  edit: '<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l3 3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  upload: '<path d="M12 16V5"/><path d="M7.5 9.5 12 5l4.5 4.5"/><path d="M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
  film: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M10 9.2v5.6l4.6-2.8z"/>',
};
const FILLED = new Set(['play', 'pause', 'prev', 'next']);
const icon = (name) => `<svg class="jg-icon${FILLED.has(name) ? ' fill' : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (sec) => { sec = Math.max(0, Math.round(sec || 0)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// 声音清单在 voices.js（桌面应用主进程共用）；window.VOICES 是它的接口
const LANG_UI = { en: '英语', ja: '日语' };        // 入口、弹窗标题用
const LANG_TEXT = { en: '英文', ja: '日文' };       // “将朗读 N 句日文”
const itemLang = (it) => (it && it.lang === 'ja' ? 'ja' : 'en');
function voiceLabel(id) {
  const v = VOICES.findVoice(id);
  if (!v) return '语音';
  const g = VOICES.GENDER[v.gender];
  if (v.engine === 'local') return `${v.region} ${g}`;
  return `${v.name}（${v.region === '日语' ? '' : v.region}${g}）· Google`;
}
const sourceLabel = (it) => (it.source === 'import' ? '导入的音频' : voiceLabel(it.voice));
const SPEEDS = [0.5, 0.6, 0.75, 0.9, 1, 1.25, 1.5];
const LOOPS = {
  all: { label: '整篇循环', icon: 'repeat' },
  one: { label: '单句循环', icon: 'repeat1' },
  none: { label: '顺序播放', icon: 'once' },
};

// ---------- 状态 ----------
const audio = $('#audio');
// 在 Mac 应用里有 window.api；在手机网页里没有，改为读取同目录的 index.json（只能收听）
const IS_APP = !!window.api;
document.body.classList.toggle('web', !IS_APP);
// 手机网页版：内容是加密的（LR1 格式，见 lib/crypto.js），输入口令后在浏览器里解密。
const WEB = {
  key: null,
  salt: null,
  async derive(pass, salt) {
    const raw = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFKC')), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' }, raw, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  },
  async decrypt(buf, key) {
    const u = new Uint8Array(buf);
    if (String.fromCharCode(u[0], u[1], u[2]) !== 'LR1') throw new Error('bad format');
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(19, 31) }, key || this.key, u.slice(31));
  },
  async fetchIndex() {
    const r = await fetch('index.enc?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return null; // 还没同步过任何内容
    return r.arrayBuffer();
  },
  // 返回 items；口令缺失或不对时抛出 'LOCKED'
  async list(pass) {
    const buf = await this.fetchIndex();
    if (!buf) return [];
    const salt = new Uint8Array(buf).slice(3, 19);
    pass = pass || localStorage.getItem('lr.pass');
    if (!pass) throw new Error('LOCKED');
    try {
      const key = await this.derive(pass, salt);
      const json = JSON.parse(new TextDecoder().decode(await this.decrypt(buf, key)));
      this.key = key;
      localStorage.setItem('lr.pass', pass);
      return json.items || [];
    } catch { localStorage.removeItem('lr.pass'); throw new Error('LOCKED'); }
  },
  blobs: new Map(),
  async audioSrc(it) {
    if (this.blobs.has(it.id)) return this.blobs.get(it.id);
    const r = await fetch(it.audioUrl);
    if (!r.ok) throw new Error('音频下载失败');
    const plain = await this.decrypt(await r.arrayBuffer());
    const url = URL.createObjectURL(new Blob([plain], { type: 'audio/mp4' }));
    this.blobs.set(it.id, url);
    return url;
  },
};
const backend = window.api || {
  list: (pass) => WEB.list(pass),
  audioSrc: (it) => WEB.audioSrc(it),
  onUpdate() {}, onPhone() {}, retry() {}, reveal() {}, remove: async () => false,
  add: async () => ({ error: '手机版只能收听' }), preview: async () => 0, settingsState: async () => ({}),
};
let items = [];
let curLang = localStorage.getItem('lr.lang') === 'ja' ? 'ja' : 'en'; // 首页当前停在哪个语言库
let cur = null;     // 正在播放的条目
let idx = 0;        // 当前高亮的句子
let lock = 0;       // 单句循环时锁定的句子
let seeking = false;
let userScrollUntil = 0;
let scrollBackTimer = null;
const settings = Object.assign({ loop: 'all', rate: 1 }, JSON.parse(localStorage.getItem('lr.settings') || '{}'));
if (!LOOPS[settings.loop]) settings.loop = 'all';
if (!SPEEDS.includes(settings.rate)) settings.rate = 1;
const saveSettings = () => localStorage.setItem('lr.settings', JSON.stringify(settings));

// ---------- 首页 ----------
function coverStyle(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = 200 + (h % 70);
  return `background:linear-gradient(150deg,hsl(${hue} 78% 72%),hsl(${(hue + 28) % 360} 70% 58%))`;
}

function dateLabel(d) {
  const t = todayStr();
  if (d === t) return '今天';
  const y = new Date(); y.setDate(y.getDate() - 1);
  const ys = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  if (d === ys) return '昨天';
  const [Y, M, D] = d.split('-').map(Number);
  return (String(Y) === t.slice(0, 4) ? '' : Y + '年') + M + '月' + D + '日';
}

// 语言切换条：按钮只建一次，之后只更新选中状态和条数（不重建，键盘焦点不会丢）
function renderLangBar() {
  const seg = $('#langSeg');
  if (!seg.children.length) {
    seg.innerHTML = Object.entries(LANG_UI).map(([k, l]) => `<button class="jg-button" type="button" data-l="${k}" aria-pressed="false">${l}<span class="cnt"></span></button>`).join('');
  }
  for (const b of seg.children) {
    const l = b.dataset.l;
    b.setAttribute('aria-pressed', String(l === curLang));
    $('.cnt', b).textContent = items.filter((it) => itemLang(it) === l).length || '';
  }
}
function setLang(l) {
  if (l === curLang) return;
  curLang = l; localStorage.setItem('lr.lang', l);
  renderHome();
  $('#homeMain').scrollTop = 0;
}
$('#langSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-l]'); if (b) setLang(b.dataset.l); });

function renderHome() {
  const main = $('#homeMain');
  renderLangBar();
  renderHomeList(main, items.filter((it) => itemLang(it) === curLang));
}

// shown：当前语言库里的条目
function renderHomeList(main, shown) {
  if (!items.length && !IS_APP) {
    main.innerHTML = `<div class="empty">
      <div class="cover" style="${coverStyle('empty')}">${icon('note')}</div>
      <h2>还没有可听的材料</h2>
      <p>在 Mac 上的“听背”里添加材料并开启手机收听后，这里会自动出现。</p></div>`;
    return;
  }
  if (!shown.length && !IS_APP) {
    main.innerHTML = `<div class="empty">
      <div class="cover" style="${coverStyle('empty-' + curLang)}">${icon('note')}</div>
      <h2>${LANG_UI[curLang]}库里还没有材料</h2>
      <p>在 Mac 上的“听背”里添加${LANG_UI[curLang]}材料后，这里会自动出现。</p></div>`;
    return;
  }
  if (!shown.length) {
    main.innerHTML = `<div class="empty">
      <div class="cover" style="${coverStyle('empty-' + curLang)}">${icon('note')}</div>
      <h2>${LANG_UI[curLang]}库里还没有材料</h2>
      <p>${curLang === 'ja'
        ? '添加一段日语材料，它会变成逐句可循环的播放页，听着就能背下来。'
        : '添加一段英语材料，或导入一段演讲、发言的音频/视频，它会变成逐句可循环的播放页，听着就能背下来。'}</p>
      <button class="jg-button" id="emptyAdd" type="button">${icon('plus')}添加第一条${LANG_UI[curLang]}材料</button></div>`;
    $('#emptyAdd').onclick = () => openAdd();
    return;
  }
  const sorted = [...shown].sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : b.createdAt - a.createdAt));
  const groups = new Map();
  for (const it of sorted) { if (!groups.has(it.date)) groups.set(it.date, []); groups.get(it.date).push(it); }
  main.innerHTML = '';
  for (const [date, list] of groups) {
    const g = document.createElement('div');
    g.className = 'group';
    g.innerHTML = `<h3>${esc(dateLabel(date))}</h3><div class="rows"></div>`;
    const rows = $('.rows', g);
    for (const it of list) rows.appendChild(rowEl(it));
    main.appendChild(g);
  }
}

function rowEl(it) {
  const el = document.createElement('div');
  el.className = 'row';
  el.dataset.status = it.status;
  let meta, extra = '', actions = '';
  if (it.status === 'generating') {
    const p = it.progress || { done: 0, total: it.sentences.length, text: '' };
    meta = p.text || `正在生成 ${p.done}/${p.total} 句`;
    if (it.source === 'import') actions = `<button class="jg-button secondary" data-act="cancel" type="button">取消导入</button>`;
    const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
    extra = `<div class="jg-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>`;
  } else if (it.status === 'error') {
    meta = `<span class="err">${it.source === 'import' ? '导入失败' : '生成失败'}：${esc(it.error || '未知错误')}</span>`;
    actions = `<button class="jg-button secondary" data-act="retry" type="button">${icon('refresh')}${it.source === 'import' ? '重新识别' : '重新生成'}</button>`;
  } else {
    meta = `${it.sentences.length} 句 · ${fmt(it.duration)} · ${sourceLabel(it)}`;
    if (it.source === 'import' && it.match != null) {
      const pct = Math.round(it.match * 100);
      meta += pct >= 85 ? ` · 与原文吻合 ${pct}%` : ` · <span class="err">与原文只吻合 ${pct}%，个别句子的位置可能不准</span>`;
    }
  }
  if (it.status !== 'generating') {
    const noAudio = it.status === 'error' && it.source === 'import'; // 导入失败的条目还没有可编辑的文字和音频
    if (!noAudio) actions += `<button class="jg-button secondary icon" data-act="edit" type="button" aria-label="编辑材料" title="编辑材料">${icon('edit')}</button>`;
    if (!noAudio) actions += `<button class="jg-button secondary icon" data-act="reveal" type="button" aria-label="在访达中显示音频" title="在访达中显示音频">${icon('folder')}</button>`;
    actions += `<button class="jg-button secondary icon" data-act="del" type="button" aria-label="删除" title="删除">${icon('trash')}</button>`;
  }
  const playing = cur && cur.id === it.id && !audio.paused;
  el.innerHTML = `
    <span class="cover" style="${coverStyle(it.id)}">${icon(playing ? 'pause' : it.status === 'ready' ? 'play' : 'note')}</span>
    <div class="row-body"><p class="row-title">${esc(it.title)}</p><p class="row-meta">${meta}</p>${extra}</div>
    <div class="row-actions">${actions}</div>`;
  if (it.status === 'ready') { el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', '播放 ' + it.title); }
  el.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) { if (it.status === 'ready') openItem(it); return; }
    e.stopPropagation();
    const act = btn.dataset.act;
    if (act === 'retry') backend.retry(it.id);
    else if (act === 'cancel') { if (await backend.cancel(it.id)) { items = items.filter((x) => x.id !== it.id); renderHome(); } }
    else if (act === 'edit') openEdit(it);
    else if (act === 'reveal') backend.reveal(it.id);
    else if (act === 'del') {
      if (btn.dataset.armed) { await removeItem(it); return; }
      btn.dataset.armed = '1';
      btn.classList.add('danger');
      btn.innerHTML = '确认删除';
      btn.style.width = 'auto';
      btn.style.padding = '8px 16px';
      setTimeout(() => { if (btn.isConnected) renderHome(); }, 3000);
    }
  });
  el.addEventListener('keydown', (e) => { if ((e.key === 'Enter') && it.status === 'ready' && e.target === el) openItem(it); });
  return el;
}

async function removeItem(it) {
  if (cur && cur.id === it.id) { audio.pause(); audio.removeAttribute('src'); audio.load(); cur = null; updateMini(); }
  const ok = await backend.remove(it.id);
  if (ok) { items = items.filter((x) => x.id !== it.id); renderHome(); }
}

function upsert(item) {
  const i = items.findIndex((x) => x.id === item.id);
  if (i >= 0) items[i] = item; else items.unshift(item);
}

// ---------- 迷你播放条（回到首页后仍可控制） ----------
function updateMini() {
  const mini = $('#mini');
  const onHome = !$('#home').hidden;
  mini.hidden = !(cur && onHome);
  if (!cur) return;
  $('#miniTitle').textContent = cur.title;
  $('#miniSub').textContent = (settings.loop === 'one' ? '单句循环' : LOOPS[settings.loop].label) + ' · ' + settings.rate + 'x';
  $('#miniCover').setAttribute('style', coverStyle(cur.id));
  $('#miniCover').innerHTML = icon('note');
  $('#miniPlay').innerHTML = icon(audio.paused ? 'play' : 'pause');
}

// ---------- 播放页 ----------
const lyrics = $('#lyrics');
const seekPos = (i) => Math.max(0, cur.sentences[i].start - 0.05);
const regionStart = (i) => (i === 0 ? seekPos(0) : cur.sentences[i].start);
function endOf(i) {
  const next = i + 1 < cur.sentences.length ? cur.sentences[i + 1].start : (cur.duration || audio.duration || 0);
  // 导入的演讲：句间可能隔着很长的停顿或掌声，单句循环只多留 0.5 秒，不把整段空白都循环进去
  return cur.source === 'import' ? Math.min(next, cur.sentences[i].end + 0.5) : next;
}
function indexAt(t) {
  const s = cur.sentences;
  for (let i = s.length - 1; i > 0; i--) if (t >= s[i].start - 0.06) return i;
  return 0;
}

function buildLyrics() {
  lyrics.lang = itemLang(cur);
  lyrics.innerHTML = cur.sentences.map((s, i) =>
    `<div class="line" data-i="${i}" role="button" tabindex="-1"><div class="en">${esc(s.text)}</div>${s.translation ? `<div class="zh">${esc(s.translation)}</div>` : ''}</div>`).join('');
}

function setActive(i, instant) {
  if (i === idx && !instant) return;
  idx = i;
  const lines = lyrics.children;
  for (let j = 0; j < lines.length; j++) {
    const d = Math.abs(j - i);
    lines[j].classList.toggle('active', j === i);
    if (d === 0) delete lines[j].dataset.d; else lines[j].dataset.d = Math.min(d, 3);
    lines[j].setAttribute('aria-current', j === i ? 'true' : 'false');
  }
  if (Date.now() > userScrollUntil) centerActive(instant);
}

function centerActive(instant) {
  const el = lyrics.children[idx];
  if (!el) return;
  const top = el.offsetTop - lyrics.clientHeight / 2 + el.offsetHeight / 2;
  lyrics.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
}

// iOS 要求 play() 发生在点击手势里。网页版要先下载解密，所以先用一小段静音“占住”播放权限。
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
async function openItem(it) {
  const same = cur && cur.id === it.id;
  if (!same) {
    cur = it;
    if (IS_APP) audio.src = it.audioUrl;
    else { audio.src = SILENT; audio.play().catch(() => {}); }
    audio.currentTime = 0;
    idx = -1; lock = 0;
    buildLyrics();
    registerMediaSession();
  }
  $('#pTitle').textContent = cur.title;
  $('#pMeta').textContent = `${dateLabel(cur.date)} · ${sourceLabel(cur)}`;
  $('#home').hidden = true;
  $('#player').hidden = false;
  applySettings();
  setActive(Math.max(idx, 0), true);
  requestAnimationFrame(() => centerActive(true));
  if (!IS_APP && !same) {
    $('#pMeta').textContent = '正在解密…';
    try { audio.src = await backend.audioSrc(it); }
    catch (e) { $('#pMeta').textContent = '加载失败：' + e.message; return; }
    $('#pMeta').textContent = `${dateLabel(cur.date)} · ${sourceLabel(cur)}`;
    applySettings();
  }
  if (!same || audio.paused) audio.play().catch(() => {});
  updateMini();
}

function closePlayer() {
  $('#player').hidden = true;
  $('#home').hidden = false;
  closeSpeed();
  renderHome();
  updateMini();
}

function applySettings() {
  audio.preservesPitch = true;
  audio.webkitPreservesPitch = true;
  audio.playbackRate = settings.rate;
  audio.loop = settings.loop === 'all';
  const l = LOOPS[settings.loop];
  $('#loopBtn').innerHTML = `${icon(l.icon)}${l.label}`;
  $('#loopBtn').title = '点击切换：整篇循环 / 单句循环 / 顺序播放（L）';
  $('#speedBtn').innerHTML = `${settings.rate}x 语速`;
  $('#speedBtn').title = '调整播放速度（变慢不变调）';
  $('#speedMenu').innerHTML = SPEEDS.map((r) =>
    `<button class="jg-button secondary" role="menuitemradio" aria-checked="${r === settings.rate}" aria-pressed="${r === settings.rate}" data-rate="${r}" type="button"><span>${r}x</span>${r === settings.rate ? icon('check') : ''}</button>`).join('');
  saveSettings();
  updateMini();
}

function cycleLoop() {
  const order = ['all', 'one', 'none'];
  settings.loop = order[(order.indexOf(settings.loop) + 1) % order.length];
  if (settings.loop === 'one' && cur) lock = idx;
  applySettings();
}

function seekTo(t, play) {
  if (!cur) return;
  const dur = cur.duration || audio.duration || 0;
  t = Math.min(Math.max(0, t), Math.max(0, dur - 0.05));
  audio.currentTime = t;
  const i = indexAt(t);
  lock = i;
  setActive(i);
  if (play && audio.paused) audio.play().catch(() => {});
  refreshProgress();
}
const seekSentence = (i, play) => seekTo(seekPos(i), play);

function prevSentence() {
  if (!cur) return;
  const i = settings.loop === 'one' ? lock : idx;
  if (audio.currentTime - regionStart(i) > 1.2) return seekSentence(i, true);
  seekSentence(Math.max(0, i - 1), true);
}
function nextSentence() {
  if (!cur) return;
  const i = (settings.loop === 'one' ? lock : idx) + 1;
  if (i >= cur.sentences.length) {
    if (settings.loop === 'none') return;
    return seekSentence(0, true);
  }
  seekSentence(i, true);
}
function togglePlay() { if (!cur) return; if (audio.paused) audio.play().catch(() => {}); else audio.pause(); }

function refreshProgress() {
  if (!cur) return;
  const dur = cur.duration || audio.duration || 0;
  const t = audio.currentTime;
  $('#tCur').textContent = fmt(t);
  $('#tTotal').textContent = fmt(dur);
  if (!seeking) {
    const p = dur ? (t / dur) * 1000 : 0;
    $('#seek').value = p;
    $('#seek').style.setProperty('--p', (p / 10) + '%');
  }
}

function tick() {
  if (!cur) return;
  const t = audio.currentTime;
  if (settings.loop === 'one') {
    if (t >= endOf(lock) - 0.04 || t < regionStart(lock) - 0.3) audio.currentTime = seekPos(lock);
    setActive(lock);
  } else {
    setActive(indexAt(t));
  }
  refreshProgress();
}
setInterval(tick, 40);
audio.addEventListener('timeupdate', tick);
audio.addEventListener('play', () => { syncPlayState(); });
audio.addEventListener('pause', () => { syncPlayState(); });
audio.addEventListener('ended', () => {
  if (!cur) return;
  if (settings.loop === 'one') { audio.currentTime = seekPos(lock); audio.play().catch(() => {}); }
  else { audio.currentTime = 0; setActive(0); refreshProgress(); syncPlayState(); }
});
audio.addEventListener('loadedmetadata', () => { applySettings(); refreshProgress(); });

function syncPlayState() {
  $('#playBtn').innerHTML = icon(audio.paused ? 'play' : 'pause');
  $('#playBtn').setAttribute('aria-label', audio.paused ? '播放' : '暂停');
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
  updateMini();
  if (!$('#home').hidden) renderHome();
}

// 系统媒体键 / 控制中心
function registerMediaSession() {
  if (!('mediaSession' in navigator) || !cur) return;
  navigator.mediaSession.metadata = new MediaMetadata({ title: cur.title, artist: '听背', album: cur.date, artwork: IS_APP ? [] : [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }] });
  const set = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch { /* 该动作不被支持 */ } };
  set('play', () => audio.play());
  set('pause', () => audio.pause());
  set('previoustrack', prevSentence);
  set('nexttrack', nextSentence);
  set('seekto', (d) => { if (d && d.seekTime != null) seekTo(d.seekTime, false); });
}

// ---------- 速度菜单 ----------
function openSpeed() { $('#speedMenu').hidden = false; $('#speedBtn').setAttribute('aria-expanded', 'true'); }
function closeSpeed() { $('#speedMenu').hidden = true; $('#speedBtn').setAttribute('aria-expanded', 'false'); }

// ---------- 添加弹窗 ----------
const dlg = $('#addDialog');
let dlgLang = 'en';     // 弹窗里这条材料的语言：添加时跟随首页当前语言库，编辑时是条目自己的语言
let voiceSel = '';      // 弹窗里选中的声音 id
let voiceOrig = '';     // 编辑时原来的声音
let hasGoogleKey = false;
let previewTimer = null;
let addMode = 'text';   // 'text' 自己输入文字 | 'import' 导入音频/视频
let picked = null;      // 导入模式下选好的文件 { path, name }
let editing = null;     // 正在编辑的条目 id；null 表示添加
let editingOrig = 0;    // 编辑导入条目时，原来的句数
const SOURCES = { text: '输入文字', import: '导入音频或视频' };
const CJK_RE = /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/;
const NBSP_HINT = '&nbsp;';

// ---------- 声音下拉 ----------
// “选过的声音排在最上面”：记录每个语言最近用过的声音（最近的在最前）；
// 加入这个功能之前生成的条目用到的声音也算选过。
const recentKey = (lang) => 'lr.recent.' + lang;
function recentVoices(lang) {
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(recentKey(lang)) || '[]'); } catch { stored = []; }
  const ids = VOICES.voicesFor(lang).map((v) => v.id);
  const out = stored.filter((id, i) => ids.includes(id) && stored.indexOf(id) === i);
  const old = items.filter((it) => itemLang(it) === lang && it.source !== 'import' && it.voice)
    .sort((a, b) => b.createdAt - a.createdAt).map((it) => it.voice);
  for (const id of old) if (ids.includes(id) && !out.includes(id)) out.push(id);
  return out;
}
function noteVoiceUsed(lang, id) {
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(recentKey(lang)) || '[]'); } catch { stored = []; }
  localStorage.setItem(recentKey(lang), JSON.stringify([id, ...stored.filter((x) => x !== id)].slice(0, 40)));
}
// 添加新材料时默认用最近用过的声音；没有云端密钥时英语默认选本地，不让一上来就报错
function pickDefaultVoice(lang) {
  const ok = (id) => hasGoogleKey || VOICES.engineOf(id) === 'local';
  return recentVoices(lang).find(ok) || VOICES.defaultVoice(lang, hasGoogleKey);
}

function voiceParts(v) {
  const g = VOICES.GENDER[v.gender];
  if (v.engine === 'local') return { main: `${v.region}${g}`, sub: '本地离线，免费' };
  return { main: v.name, sub: dlgLang === 'ja' ? `${g} · 云端` : `${v.region} · ${g} · 云端` };
}
function renderVoice() {
  const v = VOICES.findVoice(voiceSel);
  if (v) { const p = voiceParts(v); $('#fVoiceText').innerHTML = `<b>${esc(p.main)}</b><span class="voice-sub">${esc(p.sub)}</span>`; }
  if (VOICES.engineOf(voiceSel) === 'google' && !hasGoogleKey) $('#fHint').textContent = '还没有设置 Google 密钥，请先到右上角“设置”里填写。';
}
function voiceOptHtml(v) {
  const p = voiceParts(v);
  const sel = v.id === voiceSel;
  return `<button class="voice-opt" type="button" role="option" tabindex="-1" data-id="${esc(v.id)}" aria-selected="${sel}"><span class="vo-main">${esc(p.main)}</span><span class="vo-sub">${esc(p.sub)}</span>${sel ? icon('check') : '<span class="vo-gap"></span>'}</button>`;
}
function renderVoiceList() {
  const all = VOICES.voicesFor(dlgLang);
  const recent = recentVoices(dlgLang).map((id) => all.find((v) => v.id === id)).filter(Boolean);
  const rest = all.filter((v) => !recent.includes(v));
  let html = '';
  if (recent.length) html += `<div class="voice-sec" role="presentation">最近使用</div>${recent.map(voiceOptHtml).join('')}`;
  if (rest.length) html += `<div class="voice-sec" role="presentation">${recent.length ? '其他声音' : '全部声音'}</div>${rest.map(voiceOptHtml).join('')}`;
  $('#fVoiceList').innerHTML = html;
}
function openVoiceList() {
  renderVoiceList();
  $('#fVoiceList').hidden = false;
  $('#fVoiceBtn').setAttribute('aria-expanded', 'true');
  const sel = $('#fVoiceList .voice-opt[aria-selected="true"]') || $('#fVoiceList .voice-opt');
  if (sel) { $('#fVoiceList').scrollTop = 0; sel.focus({ preventScroll: true }); sel.scrollIntoView({ block: 'nearest' }); }
}
function closeVoiceList(focusBtn) {
  if ($('#fVoiceList').hidden) return false;
  $('#fVoiceList').hidden = true;
  $('#fVoiceBtn').setAttribute('aria-expanded', 'false');
  if (focusBtn) $('#fVoiceBtn').focus();
  return true;
}
function chooseVoice(id) {
  voiceSel = id;
  $('#fHint').innerHTML = NBSP_HINT;
  renderVoice();
  closeVoiceList(true);
  $('#fText').dispatchEvent(new Event('input')); // 刷新“将朗读 N 句”提示
}
$('#fVoiceBtn').addEventListener('click', () => ($('#fVoiceList').hidden ? openVoiceList() : closeVoiceList(true)));
$('#fVoiceBtn').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if ($('#fVoiceList').hidden) openVoiceList(); }
});
$('#fVoiceList').addEventListener('click', (e) => { const o = e.target.closest('.voice-opt'); if (o) chooseVoice(o.dataset.id); });
$('#fVoiceList').addEventListener('keydown', (e) => {
  const opts = [...$('#fVoiceList').querySelectorAll('.voice-opt')];
  const i = opts.indexOf(document.activeElement);
  const go = (j) => { e.preventDefault(); const o = opts[Math.max(0, Math.min(opts.length - 1, j))]; if (o) { o.focus({ preventScroll: true }); o.scrollIntoView({ block: 'nearest' }); } };
  if (e.key === 'ArrowDown') go(i + 1);
  else if (e.key === 'ArrowUp') go(i - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(opts.length - 1);
  else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeVoiceList(true); }
  else if (e.key === 'Tab') closeVoiceList(false);
});
// 点列表外面收起
dlg.addEventListener('click', (e) => { if (!e.target.closest('.voice-pick')) closeVoiceList(false); });
// 弹窗里按 Esc：列表开着时只收起列表，不关弹窗
dlg.addEventListener('cancel', (e) => { if (!$('#fVoiceList').hidden) { e.preventDefault(); closeVoiceList(true); } });
dlg.addEventListener('close', () => closeVoiceList(false));

// 导入的条目按“一行一句”编辑，不重新切句；这里只数行数
function countEditLines(text) {
  return text.split('\n').filter((l) => { const m = l.match(CJK_RE); return /[A-Za-z]/.test(m ? l.slice(0, m.index) : l); }).length;
}

function renderDrop() {
  const box = $('#fDrop');
  box.classList.toggle('has-file', !!picked);
  $('#fDropIcon').innerHTML = icon(picked ? 'film' : 'upload');
  $('#fDropMain').textContent = picked ? picked.name : '把文件拖到这里，或点击选择';
  $('#fDropSub').textContent = picked ? '点击或拖入新文件可以更换' : '支持 mp3、m4a、wav、mp4、mov、mkv、webm、flv 等常见格式（视频只取声音）';
}

// 按当前模式显示/隐藏各块，并设置按钮文字
function applyMode() {
  const imp = addMode === 'import';
  $('#fSource').innerHTML = Object.entries(SOURCES).map(([k, l]) => `<button class="jg-button" type="button" data-s="${k}" aria-pressed="${k === addMode}">${l}</button>`).join('');
  $('#fSourceWrap').hidden = !!editing || dlgLang === 'ja'; // 日语暂不支持导入音频/视频
  $('#fVoiceWrap').hidden = imp;
  $('#fText').lang = dlgLang;
  $('#fImportWrap').hidden = !(imp && !editing);
  $('#fTextWrap').hidden = false;
  const importNew = imp && !editing;
  $('#fText').classList.toggle('small', importNew);
  $('#fText').placeholder = importNew
    ? '有这段音频的文字稿就粘贴在这里（可以不填）。填了的话，歌词直接用你的原文，识别只用来对时间，文字不会出错。中文行会当作译文。'
    : dlgLang === 'ja' ? '日本語の文章をここに貼り付けてください。' : 'Paste your English text here.';
  $('#fTextLabel').textContent = importNew
    ? '原文（可选）'
    : imp
      ? '文字（每行一句；可以改字，也可以在句子下面加一行中文当译文）'
      : dlgLang === 'ja'
        ? '材料（直接粘贴；按“。！？”切句，每一行都会朗读）'
        : '材料（直接粘贴；中文行会当作译文显示，不会朗读）';
  $('#fEditNote').textContent = imp
    ? '导入的音频不会重新识别：改文字和译文不影响播放位置。每句的位置是固定的，所以只能改字，不能增删句子。'
    : '只改主题或日期不会重新生成音频；改了材料或声音，会重新生成整条音频。';
  $('#submitBtn').textContent = editing ? '保存修改' : imp ? '导入并切句' : '生成音频';
  $('#fTitle').placeholder = imp && picked ? picked.name.replace(/\.[^.]{1,5}$/, '') : dlgLang === 'ja' ? '例如：自己紹介' : '例如：面试自我介绍';
  renderDrop();
}

function importHint() {
  if (!picked) return NBSP_HINT;
  return $('#fText').value.trim() ? '' : '识别在这台 Mac 上完成，不联网，不会上传。首次使用会下载约 80MB 的识别模型。';
}

function refreshSubmit() {
  if (addMode === 'import' && !editing) $('#submitBtn').disabled = !picked;
  else $('#submitBtn').disabled = !$('#fText').value.trim();
}

async function openAdd(file) {
  editing = null; editingOrig = 0;
  dlgLang = curLang;
  if (dlgLang === 'ja') file = null; // 日语暂不支持导入音频/视频
  addMode = file && file.path ? 'import' : 'text';
  picked = file && file.path ? file : null;
  $('#addTitle').textContent = `添加${LANG_UI[dlgLang]}材料`;
  $('#fEditNote').hidden = true;
  hasGoogleKey = (await backend.settingsState()).hasGoogleKey;
  voiceSel = pickDefaultVoice(dlgLang); voiceOrig = '';
  $('#fTitle').value = '';
  $('#fDate').value = todayStr();
  $('#fText').value = '';
  $('#fHint').innerHTML = NBSP_HINT;
  renderVoice();
  applyMode();
  refreshSubmit();
  if (!dlg.open) dlg.showModal();
  if (addMode === 'text') $('#fText').focus();
}

// 把条目还原成可编辑的原文：有保存的原文就用原文，旧条目则由句子和译文拼回
function rawOf(it) {
  if (it.raw) return it.raw;
  return it.sentences.map((s) => s.text + (s.translation ? '\n' + s.translation : '')).join('\n');
}

async function openEdit(it) {
  hasGoogleKey = (await backend.settingsState()).hasGoogleKey;
  editing = it.id;
  dlgLang = itemLang(it);
  addMode = it.source === 'import' ? 'import' : 'text';
  picked = null;
  editingOrig = it.sentences.length;
  voiceSel = voiceOrig = VOICES.findVoice(it.voice) ? it.voice : VOICES.defaultVoice(dlgLang, hasGoogleKey);
  $('#addTitle').textContent = `编辑${LANG_UI[dlgLang]}材料`;
  $('#fEditNote').hidden = false;
  $('#fTitle').value = it.title;
  $('#fDate').value = it.date;
  $('#fText').value = rawOf(it);
  $('#fHint').innerHTML = NBSP_HINT;
  renderVoice();
  applyMode();
  $('#submitBtn').disabled = false;
  dlg.showModal();
  $('#fText').focus();
  if (addMode === 'import') { updateEditHint(); return; }
  const n = await backend.preview($('#fText').value, dlgLang);
  $('#fHint').textContent = n ? `将朗读 ${n} 句${LANG_TEXT[dlgLang]}。` : `没有找到可朗读的${LANG_TEXT[dlgLang]}。`;
  renderVoice();
}

function updateEditHint() {
  const n = countEditLines($('#fText').value);
  const ok = n === editingOrig;
  $('#fHint').textContent = ok ? `共 ${n} 句，和原来一致。` : `现在是 ${n} 句，原来是 ${editingOrig} 句：请保持每行一句，不要增删句子。`;
  $('#submitBtn').disabled = !ok;
}

$('#fSource').addEventListener('click', (e) => {
  const b = e.target.closest('[data-s]');
  if (!b || editing) return;
  addMode = b.dataset.s;
  $('#fHint').innerHTML = NBSP_HINT;
  applyMode(); refreshSubmit();
  if (addMode === 'text') { renderVoice(); $('#fText').dispatchEvent(new Event('input')); }
});
$('#fText').addEventListener('input', () => {
  if (editing && addMode === 'import') { updateEditHint(); return; }
  if (addMode === 'import') {
    // 导入新文件时，原文是可选的：不填就用识别出的文字
    clearTimeout(previewTimer);
    previewTimer = setTimeout(async () => {
      const t = $('#fText').value;
      if (!t.trim()) { $('#fHint').innerHTML = importHint() || NBSP_HINT; return; }
      const n = await backend.preview(t, 'en');
      $('#fHint').textContent = n ? `将按你的原文显示 ${n} 句，并用识别结果来对时间。` : '没有在原文里找到英文内容。';
      $('#submitBtn').disabled = !picked || !n;
    }, 250);
    return;
  }
  const has = $('#fText').value.trim().length > 0;
  $('#submitBtn').disabled = !has;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(async () => {
    if (!has) { $('#fHint').innerHTML = NBSP_HINT; return; }
    const n = await backend.preview($('#fText').value, dlgLang);
    $('#fHint').textContent = n ? `将朗读 ${n} 句${LANG_TEXT[dlgLang]}。` : `没有找到可朗读的${LANG_TEXT[dlgLang]}。`;
    $('#submitBtn').disabled = !n;
    if (VOICES.engineOf(voiceSel) === 'google' && !hasGoogleKey) $('#fHint').textContent = '还没有设置 Google 密钥，请先到右上角“设置”里填写。';
  }, 250);
});

// 选择文件：点击弹出系统选择窗口，或把文件拖进来
function setPicked(f) {
  picked = f;
  $('#fHint').innerHTML = NBSP_HINT;
  applyMode(); refreshSubmit();
  $('#fText').dispatchEvent(new Event('input'));
}
$('#fDrop').addEventListener('click', async () => { const f = await backend.pickMedia(); if (f) setPicked(f); });
$('#fDrop').addEventListener('keydown', async (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const f = await backend.pickMedia(); if (f) setPicked(f); } });
$('#fDrop').addEventListener('dragover', (e) => { e.preventDefault(); $('#fDrop').classList.add('over'); });
$('#fDrop').addEventListener('dragleave', () => $('#fDrop').classList.remove('over'));
$('#fDrop').addEventListener('drop', (e) => {
  e.preventDefault(); e.stopPropagation(); $('#fDrop').classList.remove('over');
  const f = e.dataTransfer.files[0];
  const p = f && backend.pathForFile(f);
  if (p) setPicked({ path: p, name: f.name });
});
// 在窗口任何位置拖入文件：直接打开“导入”（默认行为是用窗口打开该文件，必须拦掉）
if (IS_APP) {
  document.addEventListener('dragover', (e) => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  document.addEventListener('drop', async (e) => {
    e.preventDefault();
    if (sdlg.open || pdlg.open || (dlg.open && editing)) return;
    if (dlg.open ? dlgLang === 'ja' : curLang === 'ja') return; // 日语暂不支持导入音频/视频
    const f = e.dataTransfer.files[0];
    const p = f && backend.pathForFile(f);
    if (!p) return;
    if (dlg.open) { addMode = 'import'; setPicked({ path: p, name: f.name }); }
    else await openAdd({ path: p, name: f.name });
  });
}

$('#cancelBtn').onclick = () => dlg.close();
$('#addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (addMode === 'import' && !editing) {
    if (!picked) return;
    $('#submitBtn').disabled = true;
    const r = await backend.addImport({ title: $('#fTitle').value, date: $('#fDate').value, filePath: picked.path, text: $('#fText').value });
    if (r.error) { $('#fHint').textContent = r.error; $('#submitBtn').disabled = false; return; }
    upsert(r.item);
    dlg.close(); renderHome();
    return;
  }
  const text = $('#fText').value;
  if (!text.trim()) return;
  $('#submitBtn').disabled = true;
  const payload = { title: $('#fTitle').value, date: $('#fDate').value, text, voice: addMode === 'import' ? '' : voiceSel, lang: dlgLang };
  const r = editing ? await backend.update({ id: editing, ...payload }) : await backend.add(payload);
  if (r.error) { $('#fHint').textContent = r.error; $('#submitBtn').disabled = false; return; }
  // 记下这次选的声音，下次排在最上面（编辑时只有换了声音才算“选过”）
  if (addMode === 'text' && (!editing || voiceSel !== voiceOrig)) noteVoiceUsed(dlgLang, voiceSel);
  const wasPlaying = !!(editing && cur && cur.id === editing && !$('#player').hidden);
  upsert(r.item);
  if (editing && cur && cur.id === editing) {
    // 正在播放的这条被修改：停掉旧音频；重新生成的要等生成完再点开，否则用新内容重新载入
    audio.pause(); audio.removeAttribute('src'); audio.load(); cur = null; idx = -1;
    if (!(wasPlaying && !r.regenerated)) closePlayer();
  }
  dlg.close();
  if (wasPlaying && !r.regenerated) openItem(r.item); else renderHome();
});
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

// ---------- 设置（仅 Mac 应用） ----------
const sdlg = $('#settingsDialog');
async function openSettings() {
  const st = await backend.settingsState();
  hasGoogleKey = st.hasGoogleKey;
  $('#gKey').value = '';
  $('#gKey').placeholder = st.hasGoogleKey ? '已保存（出于安全不再显示），粘贴新密钥可替换' : '粘贴后点“保存并测试”';
  $('#gStatus').className = 'jg-muted tip';
  $('#gStatus').textContent = st.hasGoogleKey ? '已设置 Google 密钥。' : '还没有设置密钥。';
  $('#gClear').disabled = !st.hasGoogleKey;
  sdlg.showModal();
}
$('#keyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const key = $('#gKey').value.trim();
  if (!key) { $('#gStatus').textContent = '请先粘贴密钥。'; return; }
  $('#gSave').disabled = true;
  $('#gStatus').className = 'jg-muted tip';
  $('#gStatus').textContent = '正在向 Google 发送一次测试请求…';
  const r = await backend.setGoogleKey(key);
  $('#gSave').disabled = false;
  if (r.error) { $('#gStatus').className = 'err tip'; $('#gStatus').textContent = '测试失败：' + r.error; return; }
  hasGoogleKey = true; $('#gKey').value = ''; $('#gClear').disabled = false;
  $('#gStatus').className = 'tip'; $('#gStatus').style.color = 'var(--jg-green)';
  $('#gStatus').textContent = '测试通过，密钥已保存。现在添加材料时可以选“Google 云端”。';
});
$('#gClear').onclick = async () => { await backend.clearGoogleKey(); hasGoogleKey = false; $('#gClear').disabled = true; $('#gStatus').className = 'jg-muted tip'; $('#gStatus').style.color = ''; $('#gStatus').textContent = '密钥已删除。'; };
$('#gClose').onclick = () => sdlg.close();
sdlg.addEventListener('click', (e) => { if (e.target === sdlg) sdlg.close(); });

// ---------- 手机收听（仅 Mac 应用） ----------
const pdlg = $('#phoneDialog');
let phone = null;
function renderPhone() {
  if (!phone) return;
  const box = $('#phoneBody');
  const busy = phone.status === 'enabling' || phone.status === 'syncing';
  const when = phone.lastSync ? new Date(phone.lastSync).toLocaleString('zh-CN', { hour12: false }) : '';
  if (!phone.enabled && phone.status !== 'enabling') {
    box.innerHTML = `<p>把已生成的材料同步到一个 GitHub 公开网页，用 iPhone 的 Safari 打开就能收听，界面和这里一样。</p>
      <p class="jg-muted">网页地址是公开的，但上传的歌词和音频都用你设置的口令加密，别人打开只能看到口令页。之后每次生成或删除，都会自动同步。</p>
      <label class="jg-field"><span class="jg-label">手机访问口令（至少 8 位，建议 12 位以上；忘了只能重设）</span>
        <input id="pPass" class="jg-input" type="password" autocomplete="new-password" placeholder="设置一个只有你知道的口令"></label>
      ${phone.status === 'error' ? `<p class="err">${esc(phone.message)}</p>` : ''}
      <div class="jg-row end"><button class="jg-button secondary" data-p="close" type="button">取消</button><button class="jg-button" data-p="enable" type="button">开启手机收听</button></div>`;
  } else {
    box.innerHTML = `${phone.qr ? `<div class="qr"><img src="${phone.qr}" alt="手机收听网址二维码" width="180" height="180"><div class="qr-side">
        <p class="jg-label">用 iPhone 相机扫码</p><p class="url">${esc(phone.url)}</p>
        <button class="jg-button secondary pill" data-p="copy" type="button">复制网址</button></div></div>` : ''}
      <div class="jg-status ${phone.status === 'idle' ? 'success' : ''}">${icon(phone.status === 'idle' ? 'check' : 'refresh')}<span>${esc(phone.message || '')}${phone.status === 'idle' && phone.count != null ? ` 共 ${phone.count} 条${when ? '，' + when : ''}` : ''}</span></div>
      ${phone.status === 'error' ? '' : '<p class="jg-muted tip">第一次使用：扫码用 Safari 打开 → 点分享按钮 → “添加到主屏幕”。网页刚创建时要等 1 到 2 分钟才能打开。</p>'}
      <details class="jg-details"><summary>更改访问口令</summary>
        <div class="pass-row"><input id="pPassNew" class="jg-input" type="password" autocomplete="new-password" placeholder="新口令（至少 8 位）">
        <button class="jg-button secondary pill" data-p="pass" type="button">更改并重新加密</button></div></details>
      <div class="jg-row end"><button class="jg-button secondary" data-p="off" type="button"${busy ? ' disabled' : ''}>关闭同步</button>
      <button class="jg-button secondary" data-p="sync" type="button"${busy ? ' disabled' : ''}>立即同步</button>
      <button class="jg-button" data-p="close" type="button">完成</button></div>`;
  }
}
async function openPhone() { phone = await backend.phoneState(); renderPhone(); pdlg.showModal(); }
$('#phoneBody').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-p]');
  if (!b) return;
  const a = b.dataset.p;
  if (a === 'close') pdlg.close();
  else if (a === 'enable') {
    const pass = $('#pPass').value;
    if (pass.length < 8) { phone = { ...phone, status: 'error', message: '口令至少 8 位。' }; renderPhone(); return; }
    phone = { ...phone, status: 'enabling', message: '正在连接 GitHub…' }; renderPhone();
    const r = await backend.phoneEnable(pass);
    if (r && r.error) { phone = { ...phone, status: 'error', message: r.error }; renderPhone(); }
  }
  else if (a === 'pass') {
    const r = await backend.phoneSetPass($('#pPassNew').value);
    if (r.error) { phone = { ...phone, message: r.error }; renderPhone(); }
    else b.textContent = '已更改，正在重新加密';
  }
  else if (a === 'sync') backend.phoneSync();
  else if (a === 'off') { phone = await backend.phoneDisable(); renderPhone(); }
  else if (a === 'copy') { navigator.clipboard.writeText(phone.url).catch(() => {}); b.textContent = '已复制'; }
});
pdlg.addEventListener('click', (e) => { if (e.target === pdlg) pdlg.close(); });

// ---------- 事件绑定 ----------
$('#addBtn').innerHTML = `${icon('plus')}添加`;
$('#addBtn').onclick = () => openAdd();
$('#phoneBtn').innerHTML = `${icon('phone')}手机收听`;
$('#phoneBtn').onclick = openPhone;
$('#settingsBtn').innerHTML = `${icon('gear')}设置`;
$('#settingsBtn').onclick = openSettings;
$('#backBtn').innerHTML = icon('back');
$('#backBtn').onclick = closePlayer;
$('#editBtn').innerHTML = icon('edit');
$('#editBtn').onclick = () => cur && openEdit(cur);
$('#prevBtn').innerHTML = icon('prev');
$('#nextBtn').innerHTML = icon('next');
$('#prevBtn').onclick = prevSentence;
$('#nextBtn').onclick = nextSentence;
$('#playBtn').onclick = togglePlay;
$('#miniPlay').onclick = togglePlay;
$('#miniOpen').onclick = () => cur && openItem(cur);
$('#loopBtn').onclick = cycleLoop;
$('#speedBtn').onclick = () => ($('#speedMenu').hidden ? openSpeed() : closeSpeed());
$('#speedMenu').addEventListener('click', (e) => {
  const b = e.target.closest('[data-rate]');
  if (!b) return;
  settings.rate = Number(b.dataset.rate);
  applySettings(); closeSpeed();
});
document.addEventListener('click', (e) => { if (!e.target.closest('.speed-wrap')) closeSpeed(); });

lyrics.addEventListener('click', (e) => {
  const line = e.target.closest('.line');
  if (line) seekSentence(Number(line.dataset.i), true);
});
// 手动滚动歌词后，几秒无操作自动回到当前句
const userScrolled = () => {
  userScrollUntil = Date.now() + 4000;
  clearTimeout(scrollBackTimer);
  scrollBackTimer = setTimeout(() => centerActive(false), 4100);
};
lyrics.addEventListener('wheel', userScrolled, { passive: true });
lyrics.addEventListener('touchmove', userScrolled, { passive: true });

const seekEl = $('#seek');
seekEl.addEventListener('pointerdown', () => { seeking = true; });
seekEl.addEventListener('input', () => {
  const dur = cur ? (cur.duration || audio.duration || 0) : 0;
  seekEl.style.setProperty('--p', (seekEl.value / 10) + '%');
  $('#tCur').textContent = fmt((seekEl.value / 1000) * dur);
});
seekEl.addEventListener('change', () => {
  const dur = cur ? (cur.duration || audio.duration || 0) : 0;
  seeking = false;
  seekTo((seekEl.value / 1000) * dur, false);
});

document.addEventListener('keydown', (e) => {
  if (dlg.open || pdlg.open || sdlg.open || $('#player').hidden) return;
  if (e.target.matches('input, textarea')) return;
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSentence(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); nextSentence(); }
  else if (e.key === 'l' || e.key === 'L') cycleLoop();
  else if (e.key === 'Escape') { if (!$('#speedMenu').hidden) closeSpeed(); else closePlayer(); }
});

// ---------- 启动 ----------
backend.onUpdate((item) => { upsert(item); if (!$('#home').hidden) renderHome(); });
backend.onPhone((st) => { phone = st; if (pdlg.open) renderPhone(); });
async function start() {
  try { items = await backend.list(); } catch (e) {
    if (e.message === 'LOCKED') { showLock(); return; }
    throw e;
  }
  $('#lock').hidden = true; $('#home').hidden = false;
  syncPlayState();
  applySettings();
  renderHome();
}
function showLock(msg) {
  $('#home').hidden = true; $('#lock').hidden = false;
  $('#lockCover').setAttribute('style', coverStyle('lock'));
  $('#lockCover').innerHTML = icon('lock');
  $('#lockMsg').innerHTML = msg ? esc(msg) : '&nbsp;';
  $('#lockPass').focus();
}
$('#lockForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pass = $('#lockPass').value;
  if (!pass) return;
  $('#lockBtn').disabled = true; $('#lockMsg').className = 'jg-muted'; $('#lockMsg').textContent = '正在验证…';
  try {
    items = await backend.list(pass);
    $('#lockPass').value = '';
    $('#lockMsg').className = 'err';
    start();
  } catch {
    $('#lockMsg').className = 'err'; $('#lockMsg').textContent = '口令不对，请再试一次。';
  }
  $('#lockBtn').disabled = false;
});
start();
