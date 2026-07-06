export default function TemplateThumbnailArt({ template }) {
  const [bg, accent] = template.colors || ['#111', '#6366f1'];

  return (
    <div
      className="tpl-art"
      style={{
        '--tpl-art-bg': bg,
        '--tpl-art-accent': accent,
        '--tpl-art-accent-2': template.accent || accent,
      }}
    >
      <div className="tpl-art-glow" aria-hidden="true" />
      <div className="tpl-art-browser">
        <div className="tpl-art-chrome">
          <span className="tpl-art-dot tpl-art-dot--r" />
          <span className="tpl-art-dot tpl-art-dot--y" />
          <span className="tpl-art-dot tpl-art-dot--g" />
          <span className="tpl-art-url">portfolio.app</span>
        </div>
        <div className={`tpl-art-stage tpl-art-stage--${template.id}`}>
          {template.id === 'dev-minimal' && <DevMinimalArt />}
          {template.id === 'dark-orange-pro' && <SawadArt />}
          {template.id === 'vscode-studio' && <VscodeArt />}
          {template.id === 'creative-modern' && <SkylineArt />}
          {template.id === 'developer-classic' && <DeveloperClassicArt />}
          {template.id === 'soumya-classic' && <SoumyaClassicArt />}
          {template.id === 'aurora-flux' && <AuroraFluxArt />}
          {template.id === 'lumen-bloom' && <LumenBloomArt />}
          {template.id === 'midnight-gold' && <MidnightGoldArt />}
          {template.id === 'prism-drift' && <PrismDriftArt />}
        </div>
      </div>
    </div>
  );
}

function DevMinimalArt() {
  return (
    <>
      <div className="tpl-art-devmin-nav">
        <span className="tpl-art-pill tpl-art-pill--accent" />
        <span className="tpl-art-pill" />
        <span className="tpl-art-pill" />
      </div>
      <div className="tpl-art-devmin-body">
        <aside className="tpl-art-devmin-side">
          <span className="tpl-art-side-line tpl-art-side-line--on" />
          <span className="tpl-art-side-line" />
          <span className="tpl-art-side-line" />
          <span className="tpl-art-side-line" />
        </aside>
        <main className="tpl-art-devmin-main">
          <div className="tpl-art-avatar" />
          <div className="tpl-art-line tpl-art-line--lg" />
          <div className="tpl-art-line tpl-art-line--md tpl-art-line--accent" />
          <div className="tpl-art-line tpl-art-line--sm" />
          <div className="tpl-art-line tpl-art-line--sm tpl-art-line--short" />
          <div className="tpl-art-btn-row">
            <span className="tpl-art-btn tpl-art-btn--fill" />
            <span className="tpl-art-btn" />
          </div>
        </main>
      </div>
    </>
  );
}

function SawadArt() {
  return (
    <>
      <div className="tpl-art-sawad-top">
        <span className="tpl-art-line tpl-art-line--xs" />
        <span className="tpl-art-line tpl-art-line--xs tpl-art-line--short" />
      </div>
      <div className="tpl-art-sawad-hero">
        <div className="tpl-art-line tpl-art-line--xl tpl-art-line--bold" />
        <div className="tpl-art-line tpl-art-line--md" />
      </div>
      <div className="tpl-art-sawad-stats">
        <span className="tpl-art-stat"><i /><em>3+</em></span>
        <span className="tpl-art-stat"><i /><em>12</em></span>
        <span className="tpl-art-stat"><i /><em>∞</em></span>
      </div>
      <div className="tpl-art-marquee">
        <span>REACT</span>
        <span>NODE</span>
        <span>DOCKER</span>
        <span>FIGMA</span>
      </div>
    </>
  );
}

function VscodeArt() {
  return (
    <>
      <div className="tpl-art-vsc-title">portfolio — VS Code</div>
      <div className="tpl-art-vsc-shell">
        <div className="tpl-art-vsc-activity">
          <span className="tpl-art-vsc-act tpl-art-vsc-act--on" />
          <span className="tpl-art-vsc-act" />
          <span className="tpl-art-vsc-act" />
        </div>
        <aside className="tpl-art-vsc-explorer">
          <span className="tpl-art-vsc-file tpl-art-vsc-file--tsx" />
          <span className="tpl-art-vsc-file tpl-art-vsc-file--html" />
          <span className="tpl-art-vsc-file tpl-art-vsc-file--js" />
          <span className="tpl-art-vsc-file tpl-art-vsc-file--json" />
        </aside>
        <main className="tpl-art-vsc-editor">
          <div className="tpl-art-vsc-tabs">
            <span className="tpl-art-vsc-tab tpl-art-vsc-tab--active">home.tsx</span>
            <span className="tpl-art-vsc-tab">about.html</span>
          </div>
          <div className="tpl-art-vsc-code">
            <p><span className="kw">const</span> <span className="id">dev</span> = <span className="str">&apos;you&apos;</span>;</p>
            <p><span className="kw">export</span> <span className="kw">default</span> <span className="id">Portfolio</span>;</p>
            <p><span className="cm">// ship it</span></p>
          </div>
        </main>
        <aside className="tpl-art-vsc-copilot">
          <span className="tpl-art-vsc-copilot-head" />
          <span className="tpl-art-chip" />
          <span className="tpl-art-chip" />
          <span className="tpl-art-chip tpl-art-chip--wide" />
        </aside>
      </div>
    </>
  );
}

function SkylineArt() {
  return (
    <>
      <div className="tpl-art-sky-nav">
        <span className="tpl-art-brand">&lt;you/&gt;</span>
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-btn tpl-art-btn--fill tpl-art-btn--tiny" />
      </div>
      <div className="tpl-art-sky-hero">
        <div className="tpl-art-sky-copy">
          <span className="tpl-art-badge">● Available</span>
          <div className="tpl-art-line tpl-art-line--md" />
          <div className="tpl-art-line tpl-art-line--lg tpl-art-line--gradient" />
          <div className="tpl-art-line tpl-art-line--sm" />
          <div className="tpl-art-line tpl-art-line--sm tpl-art-line--short" />
        </div>
        <div className="tpl-art-sky-visual">
          <div className="tpl-art-code-card">
            <div className="tpl-art-code-bar" />
            <div className="tpl-art-code-lines">
              <span />
              <span />
              <span className="tpl-art-code-lines--accent" />
            </div>
          </div>
          <span className="tpl-art-float tpl-art-float--1">{'{ }'}</span>
          <span className="tpl-art-float tpl-art-float--2">npm</span>
        </div>
      </div>
    </>
  );
}

function DeveloperClassicArt() {
  return (
    <>
      <div className="tpl-art-dcls-nav">
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
      </div>
      <div className="tpl-art-dcls-hero">
        <div className="tpl-art-avatar" />
        <div className="tpl-art-dcls-copy">
          <div className="tpl-art-line tpl-art-line--lg tpl-art-line--bold" />
          <div className="tpl-art-line tpl-art-line--md tpl-art-line--accent" />
        </div>
      </div>
      <div className="tpl-art-dcls-cards">
        <span className="tpl-art-dcls-card" />
        <span className="tpl-art-dcls-card" />
        <span className="tpl-art-dcls-card" />
      </div>
    </>
  );
}

function SoumyaClassicArt() {
  return (
    <>
      <div className="tpl-art-smcls-nav">
        <span className="tpl-art-smcls-initials">AM</span>
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
      </div>
      <div className="tpl-art-smcls-hero">
        <div className="tpl-art-smcls-copy">
          <div className="tpl-art-line tpl-art-line--md" />
          <div className="tpl-art-line tpl-art-line--lg tpl-art-line--accent" />
          <div className="tpl-art-line tpl-art-line--sm tpl-art-line--accent" />
        </div>
        <div className="tpl-art-smcls-illus" />
      </div>
      <div className="tpl-art-smcls-dots" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  );
}

function AuroraFluxArt() {
  return (
    <>
      <div className="tpl-art-aflux-glow" aria-hidden="true" />
      <div className="tpl-art-aflux-dock">
        <span className="tpl-art-aflux-dot" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
      </div>
      <div className="tpl-art-aflux-hero">
        <div className="tpl-art-aflux-copy">
          <div className="tpl-art-line tpl-art-line--sm" />
          <div className="tpl-art-line tpl-art-line--lg tpl-art-line--gradient" />
          <div className="tpl-art-line tpl-art-line--md tpl-art-line--accent" />
        </div>
        <div className="tpl-art-aflux-orbit">
          <span className="tpl-art-aflux-ring" />
          <span className="tpl-art-avatar" />
        </div>
      </div>
      <div className="tpl-art-aflux-bento">
        <span className="tpl-art-aflux-tile tpl-art-aflux-tile--wide" />
        <span className="tpl-art-aflux-tile" />
        <span className="tpl-art-aflux-tile" />
      </div>
    </>
  );
}

function LumenBloomArt() {
  return (
    <>
      <div className="tpl-art-lbloom-wash" aria-hidden="true" />
      <div className="tpl-art-lbloom-ribbon">
        <span className="tpl-art-lbloom-brand" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
      </div>
      <div className="tpl-art-lbloom-hero">
        <div className="tpl-art-lbloom-copy">
          <div className="tpl-art-line tpl-art-line--md" />
          <div className="tpl-art-line tpl-art-line--lg tpl-art-line--accent" />
          <div className="tpl-art-line tpl-art-line--sm" />
        </div>
        <div className="tpl-art-lbloom-polaroid">
          <span className="tpl-art-avatar" />
        </div>
      </div>
      <div className="tpl-art-lbloom-cards">
        <span className="tpl-art-lbloom-card tpl-art-lbloom-card--wide" />
        <span className="tpl-art-lbloom-card" />
      </div>
    </>
  );
}

function MidnightGoldArt() {
  return (
    <>
      <div className="tpl-art-mgold-glow" aria-hidden="true" />
      <div className="tpl-art-mgold-nav">
        <span className="tpl-art-mgold-diamond" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
        <span className="tpl-art-pill tpl-art-pill--sm" />
      </div>
      <div className="tpl-art-mgold-hero">
        <div className="tpl-art-mgold-copy">
          <div className="tpl-art-mgold-stamp" />
          <div className="tpl-art-line tpl-art-line--xl tpl-art-line--gold" />
          <div className="tpl-art-mgold-roles" />
          <div className="tpl-art-line tpl-art-line--md" />
        </div>
        <div className="tpl-art-mgold-showcase">
          <span className="tpl-art-avatar tpl-art-avatar--tall" />
          <div className="tpl-art-mgold-stat-stack">
            <span className="tpl-art-mgold-stat" />
            <span className="tpl-art-mgold-stat" />
          </div>
        </div>
      </div>
      <div className="tpl-art-mgold-grid">
        <span className="tpl-art-mgold-tile tpl-art-mgold-tile--wide" />
        <span className="tpl-art-mgold-tile" />
      </div>
    </>
  );
}

function PrismDriftArt() {
  return (
    <>
      <div className="tpl-art-pdrift-mesh" aria-hidden="true" />
      <div className="tpl-art-pdrift-split">
        <aside className="tpl-art-pdrift-rail">
          <span className="tpl-art-pdrift-mark" />
          <span className="tpl-art-pdrift-rail-line tpl-art-pdrift-rail-line--on" />
          <span className="tpl-art-pdrift-rail-line" />
          <span className="tpl-art-pdrift-rail-line" />
        </aside>
        <div className="tpl-art-pdrift-canvas">
          <div className="tpl-art-line tpl-art-line--xl tpl-art-line--prism" />
          <div className="tpl-art-line tpl-art-line--md tpl-art-line--prism" />
          <div className="tpl-art-pdrift-signal" />
          <div className="tpl-art-pdrift-masonry">
            <span className="tpl-art-pdrift-tile tpl-art-pdrift-tile--lead" />
            <span className="tpl-art-pdrift-tile" />
          </div>
        </div>
      </div>
    </>
  );
}
