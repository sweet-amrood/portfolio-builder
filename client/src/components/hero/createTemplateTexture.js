import * as THREE from 'three';

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function fillRound(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
}

function drawChrome(ctx, x, y, w, h, url, chromeBg = '#1e1e1e') {
  fillRound(ctx, x, y, w, 36, 10, chromeBg);
  ctx.fillStyle = chromeBg;
  ctx.fillRect(x, y + 18, w, 18);

  ['#f87171', '#fbbf24', '#4ade80'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 18 + i * 16, y + 18, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  fillRound(ctx, x + 72, y + 11, Math.min(220, w - 100), 14, 7, 'rgba(255,255,255,0.08)');
  ctx.fillStyle = 'rgba(226,232,240,0.55)';
  ctx.font = '500 11px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(url, x + 82, y + 22);
}

function drawAuroraFlux(ctx, W, H, accent) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#050508');
  bg.addColorStop(0.45, '#0a1020');
  bg.addColorStop(1, '#061018');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.7, H * 0.35, 10, W * 0.7, H * 0.35, 220);
  glow.addColorStop(0, `${accent}66`);
  glow.addColorStop(0.45, '#818cf844');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const mesh = ctx.createLinearGradient(40, 40, W - 40, 120);
  mesh.addColorStop(0, '#22d3ee33');
  mesh.addColorStop(0.5, '#a78bfa44');
  mesh.addColorStop(1, '#22d3ee22');
  ctx.fillStyle = mesh;
  roundRect(ctx, 24, 24, W - 48, 90, 18);
  ctx.fill();

  fillRound(ctx, W / 2 - 90, 42, 180, 34, 17, 'rgba(15,23,42,0.72)');
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(W / 2 - 58, 59, 5, 0, Math.PI * 2);
  ctx.fill();
  fillRound(ctx, W / 2 - 42, 52, 36, 8, 4, 'rgba(255,255,255,0.35)');
  fillRound(ctx, W / 2 + 8, 52, 28, 8, 4, 'rgba(255,255,255,0.2)');
  fillRound(ctx, W / 2 + 48, 52, 22, 8, 4, 'rgba(255,255,255,0.2)');

  ctx.fillStyle = 'rgba(226,232,240,0.55)';
  ctx.font = '500 13px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('CREATIVE DEVELOPER', 48, 150);

  const titleGrad = ctx.createLinearGradient(48, 160, 340, 210);
  titleGrad.addColorStop(0, '#e0f2fe');
  titleGrad.addColorStop(0.5, accent);
  titleGrad.addColorStop(1, '#c4b5fd');
  ctx.fillStyle = titleGrad;
  ctx.font = '800 34px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Aurora Flux', 48, 190);

  ctx.fillStyle = 'rgba(148,163,184,0.85)';
  ctx.font = '500 14px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Immersive glass dock · orbital hero · bento grid', 48, 218);

  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W - 110, 190, 52, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#818cfa66';
  ctx.beginPath();
  ctx.arc(W - 110, 190, 38, 0.2, Math.PI * 1.6);
  ctx.stroke();
  const avatar = ctx.createRadialGradient(W - 110, 190, 4, W - 110, 190, 28);
  avatar.addColorStop(0, accent);
  avatar.addColorStop(1, '#312e81');
  ctx.fillStyle = avatar;
  ctx.beginPath();
  ctx.arc(W - 110, 190, 26, 0, Math.PI * 2);
  ctx.fill();

  const cards = [
    [48, 250, 170, 100, 'Projects', accent],
    [234, 250, 170, 100, 'Skills', '#818cfa'],
    [420, 250, 172, 100, 'Contact', '#34d399'],
  ];
  cards.forEach(([x, y, w, h, label, color], i) => {
    fillRound(ctx, x, y, w, h, 14, 'rgba(15,23,42,0.78)');
    ctx.strokeStyle = `${color}55`;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 14);
    ctx.stroke();
    fillRound(ctx, x + 14, y + 16, 42, 8, 4, `${color}99`);
    fillRound(ctx, x + 14, y + 36, w - 40, 10, 4, 'rgba(255,255,255,0.18)');
    fillRound(ctx, x + 14, y + 54, w - 70, 8, 4, 'rgba(255,255,255,0.1)');
    if (i === 0) {
      fillRound(ctx, x + 14, y + 72, 48, 16, 8, color);
      fillRound(ctx, x + 70, y + 72, 48, 16, 8, 'rgba(255,255,255,0.08)');
    }
    ctx.fillStyle = 'rgba(226,232,240,0.7)';
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText(label, x + 14, y + 92);
  });
}

function drawDevMinimal(ctx, W, H, accent) {
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, W, H);

  fillRound(ctx, 20, 20, W - 40, H - 40, 12, '#0c0c0f');
  fillRound(ctx, 20, 20, W - 40, 44, 12, '#111114');
  ctx.fillStyle = '#111114';
  ctx.fillRect(20, 40, W - 40, 24);

  ctx.fillStyle = accent;
  fillRound(ctx, 40, 34, 54, 16, 8, accent);
  fillRound(ctx, 104, 36, 36, 12, 6, 'rgba(255,255,255,0.12)');
  fillRound(ctx, 148, 36, 36, 12, 6, 'rgba(255,255,255,0.08)');
  fillRound(ctx, 192, 36, 36, 12, 6, 'rgba(255,255,255,0.08)');

  ctx.fillStyle = '#18181b';
  ctx.fillRect(20, 64, 150, H - 84);

  const nav = ['Home', 'Work', 'Skills', 'About', 'Contact'];
  nav.forEach((label, i) => {
    const y = 92 + i * 36;
    if (i === 0) {
      fillRound(ctx, 36, y - 10, 118, 28, 8, `${accent}33`);
      ctx.fillStyle = accent;
      ctx.fillRect(20, y - 6, 3, 20);
    }
    ctx.fillStyle = i === 0 ? '#fafafa' : 'rgba(161,161,170,0.85)';
    ctx.font = `${i === 0 ? '600' : '500'} 13px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(label, 48, y + 6);
  });

  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.arc(220, 120, 34, 0, Math.PI * 2);
  ctx.fill();
  const ring = ctx.createRadialGradient(220, 120, 10, 220, 120, 34);
  ring.addColorStop(0, '#c4b5fd');
  ring.addColorStop(1, accent);
  ctx.fillStyle = ring;
  ctx.beginPath();
  ctx.arc(220, 120, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fafafa';
  ctx.font = '700 28px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Alex Rivera', 272, 116);
  ctx.fillStyle = accent;
  ctx.font = '600 15px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Full-stack engineer', 272, 140);
  ctx.fillStyle = 'rgba(161,161,170,0.9)';
  ctx.font = '500 13px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Docs-style layout · clean sections · subtle motion', 272, 164);

  fillRound(ctx, 272, 184, 108, 32, 8, accent);
  ctx.fillStyle = '#fff';
  ctx.font = '600 13px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('View work', 292, 205);
  fillRound(ctx, 392, 184, 108, 32, 8, 'rgba(255,255,255,0.08)');
  ctx.fillStyle = 'rgba(250,250,250,0.8)';
  ctx.fillText('Resume', 420, 205);

  [[272, 240, 150, 90], [438, 240, 150, 90], [272, 342, 150, 48], [438, 342, 150, 48]].forEach(([x, y, w, h], i) => {
    fillRound(ctx, x, y, w, h, 10, '#18181b');
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 10);
    ctx.stroke();
    fillRound(ctx, x + 12, y + 14, Math.min(70, w - 24), 8, 4, i % 2 === 0 ? `${accent}99` : 'rgba(255,255,255,0.2)');
    fillRound(ctx, x + 12, y + 32, w - 36, 7, 3, 'rgba(255,255,255,0.12)');
    if (h > 60) fillRound(ctx, x + 12, y + 48, w - 56, 7, 3, 'rgba(255,255,255,0.08)');
  });
}

function drawVscodeStudio(ctx, W, H, accent) {
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#323233';
  ctx.fillRect(0, 0, W, 28);
  ctx.fillStyle = 'rgba(204,204,204,0.85)';
  ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('portfolio — VS Code Studio', 14, 18);

  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 28, 42, H - 28);
  ['#007acc', '#cccccc55', '#cccccc44'].forEach((color, i) => {
    fillRound(ctx, 10, 44 + i * 36, 22, 22, 4, color === '#007acc' ? `${accent}55` : 'rgba(255,255,255,0.06)');
    ctx.fillStyle = color === '#007acc' ? accent : 'rgba(204,204,204,0.45)';
    ctx.fillRect(16, 50 + i * 36, 10, 10);
  });

  ctx.fillStyle = '#252526';
  ctx.fillRect(42, 28, 150, H - 28);
  ctx.fillStyle = 'rgba(204,204,204,0.55)';
  ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('EXPLORER', 54, 48);

  const files = [
    { name: 'home.tsx', color: '#519aba' },
    { name: 'about.html', color: '#e37933' },
    { name: 'skills.js', color: '#cbcb41' },
    { name: 'package.json', color: '#e8b03b' },
    { name: 'README.md', color: '#519aba' },
  ];
  files.forEach((file, i) => {
    const y = 68 + i * 28;
    if (i === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(42, y - 12, 150, 26);
    }
    ctx.fillStyle = file.color;
    ctx.fillRect(54, y - 4, 10, 10);
    ctx.fillStyle = i === 0 ? '#ffffff' : 'rgba(204,204,204,0.8)';
    ctx.font = '500 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(file.name, 72, y + 5);
  });

  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(192, 28, W - 192 - 150, H - 28);
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(192, 28, W - 192 - 150, 32);
  fillRound(ctx, 200, 34, 88, 22, 4, '#1e1e1e');
  ctx.fillStyle = '#cccccc';
  ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('home.tsx', 214, 49);
  ctx.fillStyle = accent;
  ctx.fillRect(200, 54, 88, 2);
  ctx.fillStyle = 'rgba(204,204,204,0.45)';
  ctx.fillText('about.html', 304, 49);

  const codeX = 210;
  const lines = [
    [{ t: 'const ', c: '#569cd6' }, { t: 'dev', c: '#9cdcfe' }, { t: ' = ', c: '#d4d4d4' }, { t: "'you'", c: '#ce9178' }, { t: ';', c: '#d4d4d4' }],
    [{ t: 'export ', c: '#c586c0' }, { t: 'default ', c: '#569cd6' }, { t: 'Portfolio', c: '#4ec9b0' }, { t: ';', c: '#d4d4d4' }],
    [{ t: '// ship it to production', c: '#6a9955' }],
    [{ t: 'function ', c: '#569cd6' }, { t: 'build', c: '#dcdcaa' }, { t: '() {', c: '#d4d4d4' }],
    [{ t: '  return ', c: '#c586c0' }, { t: '<Hero />', c: '#4ec9b0' }, { t: ';', c: '#d4d4d4' }],
    [{ t: '}', c: '#d4d4d4' }],
  ];
  lines.forEach((parts, i) => {
    let x = codeX;
    const y = 92 + i * 28;
    ctx.fillStyle = 'rgba(133,133,133,0.55)';
    ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(String(i + 1), codeX - 18, y);
    parts.forEach((part) => {
      ctx.fillStyle = part.c;
      ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(part.t, x, y);
      x += ctx.measureText(part.t).width;
    });
  });

  ctx.fillStyle = '#252526';
  ctx.fillRect(W - 150, 28, 150, H - 28);
  ctx.fillStyle = '#c586c0';
  fillRound(ctx, W - 134, 48, 118, 10, 4, '#c586c0');
  ctx.fillStyle = 'rgba(204,204,204,0.7)';
  ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('COPILOT', W - 134, 78);
  fillRound(ctx, W - 134, 94, 118, 36, 8, 'rgba(255,255,255,0.05)');
  fillRound(ctx, W - 134, 140, 90, 22, 8, `${accent}55`);
  fillRound(ctx, W - 134, 172, 118, 22, 8, 'rgba(255,255,255,0.05)');
  fillRound(ctx, W - 134, 204, 70, 22, 8, 'rgba(255,255,255,0.05)');

  ctx.fillStyle = '#007acc';
  ctx.fillRect(0, H - 22, W, 22);
  ctx.fillStyle = '#fff';
  ctx.font = '500 10px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('main*', 12, H - 8);
  ctx.fillText('TypeScript React', W - 120, H - 8);
}

function drawGeneric(ctx, W, H, template, accent, bg) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, bg);
  grad.addColorStop(1, '#05080f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawChrome(ctx, 24, 24, W - 48, H - 48, 'Novafolio.app', '#111827');
  fillRound(ctx, 24, 60, W - 48, H - 84, 0, 'rgba(15,23,42,0.92)');
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 24px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(template.name, 48, 110);
  ctx.fillStyle = accent;
  ctx.font = '600 13px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText((template.tags || []).slice(0, 3).join(' · '), 48, 138);
  [[48, 170, 240, 120], [308, 170, 260, 54], [308, 236, 260, 54], [48, 310, 520, 60]].forEach(([x, y, w, h], i) => {
    fillRound(ctx, x, y, w, h, 10, i === 0 ? `${accent}44` : 'rgba(30,41,59,0.9)');
  });
}

export function createTemplateTexture(template) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  const [bg, accentAlt] = template.colors || ['#0a0f1e', '#6366f1'];
  const accent = template.accent || accentAlt;
  const id = template.id;

  if (id === 'aurora-flux') drawAuroraFlux(ctx, canvas.width, canvas.height, accent);
  else if (id === 'dev-minimal') drawDevMinimal(ctx, canvas.width, canvas.height, accent);
  else if (id === 'vscode-studio') drawVscodeStudio(ctx, canvas.width, canvas.height, accent);
  else drawGeneric(ctx, canvas.width, canvas.height, template, accent, bg);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
