const PORTFOLIO_MOCKS = [
  {
    id: 'dev-dark',
    bg: '#0d1117',
    nav: '#161b22',
    hero: 'linear-gradient(135deg,#238636,#1f6feb)',
    text: '#e6edf3',
    sub: '#8b949e',
    layout: 'center',
    label: 'Alex Chen',
    role: 'Full Stack Dev',
  },
  {
    id: 'designer-light',
    bg: '#faf9f7',
    nav: '#f0eeeb',
    hero: '#1a1a1a',
    text: '#1a1a1a',
    sub: '#6b6b6b',
    layout: 'minimal',
    label: 'Sarah Kim',
    role: 'UI Designer',
  },
  {
    id: 'creative-gradient',
    bg: '#1a0533',
    nav: '#2d1b69',
    hero: 'linear-gradient(90deg,#ff6b6b,#feca57)',
    text: '#ffffff',
    sub: '#c4b5fd',
    layout: 'bold',
    label: 'Marcus Lee',
    role: 'Creative Dir.',
  },
  {
    id: 'photo-hero',
    bg: '#111',
    nav: '#1c1c1c',
    hero: 'linear-gradient(180deg,#333,#111)',
    text: '#fff',
    sub: '#aaa',
    layout: 'photo',
    label: 'Emma Walsh',
    role: 'Photographer',
  },
  {
    id: 'agency-blue',
    bg: '#0a1628',
    nav: '#0f2040',
    hero: '#3b82f6',
    text: '#e2e8f0',
    sub: '#64748b',
    layout: 'agency',
    label: 'Studio Nova',
    role: 'Digital Agency',
  },
  {
    id: 'pastel-soft',
    bg: '#fdf2f8',
    nav: '#fce7f3',
    hero: '#ec4899',
    text: '#831843',
    sub: '#9d174d',
    layout: 'minimal',
    label: 'Lily Park',
    role: 'Brand Designer',
  },
  {
    id: 'terminal',
    bg: '#0c0c0c',
    nav: '#1a1a1a',
    hero: '#00ff41',
    text: '#00ff41',
    sub: '#008f11',
    layout: 'terminal',
    label: '> dev@portfolio',
    role: 'Engineer',
  },
  {
    id: 'warm-earth',
    bg: '#1c1917',
    nav: '#292524',
    hero: '#d97706',
    text: '#fafaf9',
    sub: '#a8a29e',
    layout: 'center',
    label: 'James Okafor',
    role: 'Product Designer',
  },
  {
    id: 'ocean',
    bg: '#042f2e',
    nav: '#0d4f4f',
    hero: '#14b8a6',
    text: '#ccfbf1',
    sub: '#5eead4',
    layout: 'split',
    label: 'Nina Costa',
    role: 'UX Researcher',
  },
  {
    id: 'brutalist',
    bg: '#ffff00',
    nav: '#000',
    hero: '#000',
    text: '#000',
    sub: '#333',
    layout: 'brutal',
    label: 'TYLER REX',
    role: 'ART DIRECTOR',
  },
  {
    id: 'mono-elegant',
    bg: '#18181b',
    nav: '#27272a',
    hero: '#fafafa',
    text: '#fafafa',
    sub: '#71717a',
    layout: 'elegant',
    label: 'Victoria Hayes',
    role: 'Architect',
  },
  {
    id: 'coral-pop',
    bg: '#fff1f2',
    nav: '#ffe4e6',
    hero: '#f43f5e',
    text: '#881337',
    sub: '#be123c',
    layout: 'bold',
    label: 'Zoe Martinez',
    role: 'Illustrator',
  },
  {
    id: 'forest',
    bg: '#14532d',
    nav: '#166534',
    hero: '#86efac',
    text: '#f0fdf4',
    sub: '#bbf7d0',
    layout: 'center',
    label: 'Ryan Brooks',
    role: 'Motion Design',
  },
  {
    id: 'indigo-saas',
    bg: '#eef2ff',
    nav: '#e0e7ff',
    hero: '#4f46e5',
    text: '#312e81',
    sub: '#6366f1',
    layout: 'agency',
    label: 'Cloudbase',
    role: 'SaaS Product',
  },
  {
    id: 'sunset',
    bg: '#1a0a00',
    nav: '#2d1400',
    hero: 'linear-gradient(135deg,#f97316,#ef4444)',
    text: '#fff7ed',
    sub: '#fdba74',
    layout: 'photo',
    label: 'Aiden Cross',
    role: 'Filmmaker',
  },
  {
    id: 'lavender',
    bg: '#2e1065',
    nav: '#3b0764',
    hero: '#a78bfa',
    text: '#ede9fe',
    sub: '#c4b5fd',
    layout: 'split',
    label: 'Maya Singh',
    role: '3D Artist',
  },
  {
    id: 'clean-white',
    bg: '#ffffff',
    nav: '#f8fafc',
    hero: '#0f172a',
    text: '#0f172a',
    sub: '#64748b',
    layout: 'minimal',
    label: 'Tom Bradley',
    role: 'Consultant',
  },
  {
    id: 'cyber',
    bg: '#030712',
    nav: '#111827',
    hero: 'linear-gradient(90deg,#06b6d4,#8b5cf6)',
    text: '#f9fafb',
    sub: '#6b7280',
    layout: 'terminal',
    label: 'NEO//DEV',
    role: 'Cybersecurity',
  },
  {
    id: 'magazine',
    bg: '#fef3c7',
    nav: '#fde68a',
    hero: '#92400e',
    text: '#451a03',
    sub: '#b45309',
    layout: 'elegant',
    label: 'Clara Fontaine',
    role: 'Editorial',
  },
  {
    id: 'glass',
    bg: 'linear-gradient(160deg,#1e3a5f,#0f172a)',
    nav: 'rgba(255,255,255,0.08)',
    hero: 'rgba(56,189,248,0.6)',
    text: '#f0f9ff',
    sub: '#7dd3fc',
    layout: 'center',
    label: 'Glassworks',
    role: 'Web Studio',
  },
  {
    id: 'red-minimal',
    bg: '#450a0a',
    nav: '#7f1d1d',
    hero: '#fca5a5',
    text: '#fef2f2',
    sub: '#fecaca',
    layout: 'bold',
    label: 'Kira Volkov',
    role: 'Fashion',
  },
  {
    id: 'mint-fresh',
    bg: '#ecfdf5',
    nav: '#d1fae5',
    hero: '#059669',
    text: '#064e3b',
    sub: '#047857',
    layout: 'agency',
    label: 'Greenpath',
    role: 'Startup',
  },
  {
    id: 'slate-pro',
    bg: '#1e293b',
    nav: '#334155',
    hero: '#f8fafc',
    text: '#f8fafc',
    sub: '#94a3b8',
    layout: 'split',
    label: 'David Park',
    role: 'Data Scientist',
  },
  {
    id: 'gold-lux',
    bg: '#0c0a09',
    nav: '#1c1917',
    hero: 'linear-gradient(135deg,#ca8a04,#eab308)',
    text: '#fefce8',
    sub: '#a16207',
    layout: 'elegant',
    label: 'Aurelius & Co',
    role: 'Luxury Brand',
  },
];

const SCREENSHOTS = [
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691747-187a29b1aadc?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499951360877-927a90232307?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=280&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=280&fit=crop&q=80',
];

const TILE_COUNT = 160;

const buildTiles = () =>
  Array.from({ length: TILE_COUNT }, (_, i) => {
    if (i % 5 === 0) {
      return {
        type: 'screenshot',
        src: SCREENSHOTS[i % SCREENSHOTS.length],
        id: `shot-${i}`,
      };
    }
    return {
      type: 'mock',
      mock: PORTFOLIO_MOCKS[i % PORTFOLIO_MOCKS.length],
      id: `mock-${i}`,
    };
  });

const TILES = buildTiles();

function PortfolioFrontMock({ mock }) {
  const heroStyle = {
    background: mock.hero,
    color: typeof mock.hero === 'string' && !mock.hero.includes('gradient') ? mock.bg : undefined,
  };

  return (
    <div className="pf-mock" style={{ background: mock.bg }}>
      <div className="pf-mock-nav" style={{ background: mock.nav }}>
        <span className="pf-mock-logo" style={{ color: mock.text }} />
        <span className="pf-mock-nav-links">
          <i style={{ background: mock.sub }} />
          <i style={{ background: mock.sub }} />
          <i style={{ background: mock.sub }} />
        </span>
      </div>

      {mock.layout === 'center' && (
        <div className="pf-mock-hero pf-mock-hero--center">
          <div className="pf-mock-avatar" style={heroStyle} />
          <p className="pf-mock-name" style={{ color: mock.text }}>{mock.label}</p>
          <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          <span className="pf-mock-btn" style={{ background: mock.hero }} />
        </div>
      )}

      {mock.layout === 'minimal' && (
        <div className="pf-mock-hero pf-mock-hero--minimal">
          <p className="pf-mock-name pf-mock-name--lg" style={{ color: mock.text }}>{mock.label}</p>
          <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          <div className="pf-mock-line" style={{ background: mock.hero }} />
        </div>
      )}

      {mock.layout === 'bold' && (
        <div className="pf-mock-hero pf-mock-hero--bold">
          <p className="pf-mock-name pf-mock-name--xl" style={{ color: mock.text }}>{mock.label}</p>
          <div className="pf-mock-block" style={heroStyle} />
        </div>
      )}

      {mock.layout === 'photo' && (
        <div className="pf-mock-hero pf-mock-hero--photo">
          <div className="pf-mock-photo" style={heroStyle} />
          <div className="pf-mock-photo-text">
            <p className="pf-mock-name" style={{ color: mock.text }}>{mock.label}</p>
            <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          </div>
        </div>
      )}

      {mock.layout === 'agency' && (
        <div className="pf-mock-hero pf-mock-hero--agency">
          <p className="pf-mock-name" style={{ color: mock.text }}>{mock.label}</p>
          <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          <div className="pf-mock-cards">
            <span style={{ background: mock.nav }} />
            <span style={{ background: mock.nav }} />
            <span style={{ background: mock.nav }} />
          </div>
        </div>
      )}

      {mock.layout === 'terminal' && (
        <div className="pf-mock-hero pf-mock-hero--terminal">
          <p style={{ color: mock.hero }}>{mock.label}</p>
          <p style={{ color: mock.sub }}>{mock.role}</p>
          <div className="pf-mock-code">
            <span style={{ background: mock.nav }} />
            <span style={{ background: mock.nav }} />
            <span style={{ background: mock.nav, width: '70%' }} />
          </div>
        </div>
      )}

      {mock.layout === 'split' && (
        <div className="pf-mock-hero pf-mock-hero--split">
          <div className="pf-mock-split-text">
            <p className="pf-mock-name" style={{ color: mock.text }}>{mock.label}</p>
            <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          </div>
          <div className="pf-mock-split-img" style={heroStyle} />
        </div>
      )}

      {mock.layout === 'brutal' && (
        <div className="pf-mock-hero pf-mock-hero--brutal">
          <p className="pf-mock-name pf-mock-name--xl" style={{ color: mock.text }}>{mock.label}</p>
          <p style={{ color: mock.sub, fontSize: '5px', fontWeight: 700 }}>{mock.role}</p>
        </div>
      )}

      {mock.layout === 'elegant' && (
        <div className="pf-mock-hero pf-mock-hero--elegant">
          <p className="pf-mock-role" style={{ color: mock.sub }}>{mock.role}</p>
          <p className="pf-mock-name" style={{ color: mock.text }}>{mock.label}</p>
          <div className="pf-mock-divider" style={{ background: mock.hero }} />
        </div>
      )}

      <div className="pf-mock-projects">
        <span style={{ background: mock.nav }} />
        <span style={{ background: mock.nav }} />
        <span style={{ background: mock.nav }} />
      </div>
    </div>
  );
}

export default function PortfolioMosaicBg() {
  return (
    <div className="auth-mosaic-wrap" aria-hidden="true">
      <div className="auth-mosaic auth-mosaic--layer1">
        {TILES.map((tile) => (
          <div key={tile.id} className="auth-mosaic-tile">
            {tile.type === 'screenshot' ? (
              <img src={tile.src} alt="" loading="eager" draggable="false" />
            ) : (
              <PortfolioFrontMock mock={tile.mock} />
            )}
          </div>
        ))}
      </div>
      <div className="auth-mosaic auth-mosaic--layer2">
        {TILES.slice(0, 80).map((tile, i) => (
          <div key={`l2-${tile.id}`} className="auth-mosaic-tile">
            {tile.type === 'screenshot' ? (
              <img src={SCREENSHOTS[(i + 5) % SCREENSHOTS.length]} alt="" loading="eager" draggable="false" />
            ) : (
              <PortfolioFrontMock mock={PORTFOLIO_MOCKS[(i + 8) % PORTFOLIO_MOCKS.length]} />
            )}
          </div>
        ))}
      </div>
      <div className="auth-mosaic-overlay" />
    </div>
  );
}
