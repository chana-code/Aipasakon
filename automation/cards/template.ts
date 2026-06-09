import type { CardConfig, HookSpan } from '../types';
import { THEMES } from './themes';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function spanHtml(s: HookSpan): string {
  const classes: string[] = [];
  if (s.style === 'lead') classes.push('lead');
  if (s.style === 'accent') classes.push('accent');
  if (s.style === 'mark') classes.push('mark');
  if (s.nowrap) classes.push('nb');
  const cls = classes.length ? ` class="${classes.join(' ')}"` : '';
  return `<span${cls}>${esc(s.text)}</span>`;
}

export function buildCardHtml(config: CardConfig, logoDataUri: string): string {
  const t = THEMES[config.track];
  const hook = config.hook.map(spanHtml).join(' ');
  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{font-family:"Prompt",system-ui,sans-serif}
.card{width:1080px;height:1350px;background:${t.bg};padding:100px 92px 84px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.card::before{content:"";position:absolute;top:0;left:0;width:100%;height:14px;background:${t.bar}}
.kicker{display:flex;align-items:center;gap:18px;margin-bottom:60px}
.kicker .dot{width:14px;height:14px;border-radius:50%;background:${t.accent}}
.kicker .label{font-weight:600;font-size:31px;letter-spacing:.04em;color:${t.kick}}
.body{flex:1;display:flex;align-items:center;overflow:hidden}
.hook{font-weight:600;font-size:var(--hooksize,80px);line-height:1.4;color:${t.ink};letter-spacing:-0.01em;text-wrap:balance}
.hook .lead{font-weight:500;color:${t.lead}}
.hook .accent{color:${t.accent};font-weight:700}
.hook .nb{white-space:nowrap}
.hook .mark{font-weight:700;color:#00143C;background:#FDF6E0;box-shadow:inset 0 -8px 0 #E8C547;padding:2px 10px;border-radius:5px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.footer{display:flex;align-items:center;gap:30px;margin-top:56px;padding-top:46px;border-top:2px solid ${t.rule}}
.footer img{width:150px;height:150px;display:block;object-fit:contain}
.footer .meta{display:flex;flex-direction:column;gap:6px}
.footer .site{font-weight:600;font-size:36px;color:${t.site}}
.footer .tag{font-weight:400;font-size:27px;color:${t.tag}}
</style></head><body>
<div class="card">
  <div class="kicker"><span class="dot"></span><span class="label">${esc(config.kicker)}</span></div>
  <div class="body"><div class="hook">${hook}</div></div>
  <div class="footer"><img src="${esc(logoDataUri)}" alt="AI ภาษาคน"><div class="meta"><span class="site">aipasakon.com</span><span class="tag">AI ไม่ยาก ถ้าพูดภาษาคน</span></div></div>
</div></body></html>`;
}
