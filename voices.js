// 声音清单：桌面应用的主进程和界面共用这一份（界面以 <script> 加载，主进程以 require 加载）。
// Google Chirp3-HD 的 30 种声音名在英语（en-US / en-GB）和日语（ja-JP）里一致，
// 清单来自 Google 官方 voices.list 接口（2026-11-18 核对：三个语言区各 30 种）。
(function (root) {
  const CHIRP = [
    ['Achernar', 'F'], ['Achird', 'M'], ['Algenib', 'M'], ['Algieba', 'M'], ['Alnilam', 'M'],
    ['Aoede', 'F'], ['Autonoe', 'F'], ['Callirrhoe', 'F'], ['Charon', 'M'], ['Despina', 'F'],
    ['Enceladus', 'M'], ['Erinome', 'F'], ['Fenrir', 'M'], ['Gacrux', 'F'], ['Iapetus', 'M'],
    ['Kore', 'F'], ['Laomedeia', 'F'], ['Leda', 'F'], ['Orus', 'M'], ['Puck', 'M'],
    ['Pulcherrima', 'F'], ['Rasalgethi', 'M'], ['Sadachbia', 'M'], ['Sadaltager', 'M'], ['Schedar', 'M'],
    ['Sulafat', 'F'], ['Umbriel', 'M'], ['Vindemiatrix', 'F'], ['Zephyr', 'F'], ['Zubenelgenubi', 'M'],
  ];
  const GENDER = { F: '女声', M: '男声' };

  // 各语言区：Google 云端按区域列出全部声音；本地离线（Kokoro）只有英语
  const REGIONS = {
    en: [{ code: 'en-US', label: '美音' }, { code: 'en-GB', label: '英音' }],
    ja: [{ code: 'ja-JP', label: '日语' }],
  };
  const LOCAL = [
    { id: 'af_heart', label: '美音', gender: 'F' }, { id: 'am_michael', label: '美音', gender: 'M' },
    { id: 'bf_emma', label: '英音', gender: 'F' }, { id: 'bm_george', label: '英音', gender: 'M' },
  ];

  const cache = {};
  // 某语言下全部可选声音，按默认顺序：云端各区域，然后（仅英语）本地
  function voicesFor(lang) {
    if (cache[lang]) return cache[lang];
    const out = [];
    for (const r of REGIONS[lang] || []) {
      for (const [name, g] of CHIRP) {
        out.push({ id: `${r.code}-Chirp3-HD-${name}`, engine: 'google', region: r.label, name, gender: g, label: `${r.label} · ${name} · ${GENDER[g]}` });
      }
    }
    if (lang === 'en') {
      for (const v of LOCAL) out.push({ id: v.id, engine: 'local', region: v.label, name: '', gender: v.gender, label: `${v.label} · ${GENDER[v.gender]} · 本地` });
    }
    cache[lang] = out;
    return out;
  }
  const defaultVoice = (lang, hasKey) => (lang === 'ja' || hasKey ? `${REGIONS[lang][0].code}-Chirp3-HD-Aoede` : 'af_heart');
  const engineOf = (id) => (/-Chirp3-HD-/.test(String(id)) ? 'google' : 'local');
  const findVoice = (id) => {
    for (const lang of Object.keys(REGIONS)) { const v = voicesFor(lang).find((x) => x.id === id); if (v) return v; }
    return null;
  };
  const langOfVoice = (id) => (/^ja-/.test(String(id)) ? 'ja' : 'en');

  const api = { voicesFor, defaultVoice, engineOf, findVoice, langOfVoice, GENDER, LANGS: { en: '英语', ja: '日语' } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VOICES = api;
})(typeof window !== 'undefined' ? window : globalThis);
