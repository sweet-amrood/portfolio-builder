import { motion } from 'framer-motion';

const floatA = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

const floatB = {
  animate: { y: [0, 12, 0], rotate: [0, 3, 0] },
  transition: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
};

const floatC = {
  animate: { y: [0, -8, 0], x: [0, 6, 0] },
  transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
};

export default function HeroScene({ animate = true }) {
  const motionProps = (config) => (animate ? config : {});

  return (
    <div className="cmod-hero-scene" aria-hidden="true">
      <div className="cmod-hero-scene-aura" />
      <motion.div
        className="cmod-hero-scene-ring"
        {...motionProps({
          animate: { rotate: 360 },
          transition: { duration: 28, repeat: Infinity, ease: 'linear' },
        })}
      />
      <motion.div
        className="cmod-hero-scene-ring cmod-hero-scene-ring--inner"
        {...motionProps({
          animate: { rotate: -360 },
          transition: { duration: 20, repeat: Infinity, ease: 'linear' },
        })}
      />

      <motion.div className="cmod-hero-code" {...motionProps(floatA)}>
        <div className="cmod-hero-code-bar">
          <span className="cmod-hero-code-dot cmod-hero-code-dot--r" />
          <span className="cmod-hero-code-dot cmod-hero-code-dot--y" />
          <span className="cmod-hero-code-dot cmod-hero-code-dot--g" />
          <span className="cmod-hero-code-filename">portfolio.tsx</span>
        </div>
        <div className="cmod-hero-code-body">
          <p>
            <span className="cmod-hl-kw">const</span>{' '}
            <span className="cmod-hl-id">builder</span> = {'{'}
          </p>
          <p>
            {'  '}
            <span className="cmod-hl-key">name</span>: <span className="cmod-hl-str">&apos;you&apos;</span>,
          </p>
          <p>
            {'  '}
            <span className="cmod-hl-key">stack</span>: [
            <span className="cmod-hl-str">&apos;React&apos;</span>,{' '}
            <span className="cmod-hl-str">&apos;Node&apos;</span>],
          </p>
          <p>
            {'  '}
            <span className="cmod-hl-key">ship</span>: <span className="cmod-hl-fn">launch</span>
            <span className="cmod-hl-cursor" />
          </p>
          <p>{'};'}</p>
        </div>
      </motion.div>

      <motion.div className="cmod-hero-chip cmod-hero-chip--brackets" {...motionProps(floatB)}>
        {'{ }'}
      </motion.div>

      <motion.div className="cmod-hero-chip cmod-hero-chip--tag" {...motionProps(floatC)}>
        {'</>'}
      </motion.div>

      <motion.div className="cmod-hero-chip cmod-hero-chip--npm" {...motionProps(floatA)}>
        npm run build
      </motion.div>

      <motion.div className="cmod-hero-stat" {...motionProps(floatC)}>
        <span className="cmod-hero-stat-value">100%</span>
        <span className="cmod-hero-stat-label">pixel perfect</span>
      </motion.div>

      <motion.div className="cmod-hero-orbit-icon" {...motionProps(floatB)}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </motion.div>

      <svg className="cmod-hero-scene-svg" viewBox="0 0 200 120" fill="none">
        <defs>
          <linearGradient id="cmod-laptop-grad" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--cmod-accent)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--cmod-secondary)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M20 88 L100 108 L180 88 L180 72 L100 52 L20 72 Z"
          fill="url(#cmod-laptop-grad)"
          stroke="var(--cmod-accent)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <path
          d="M28 72 L100 48 L172 72 L172 28 Q172 18 162 18 L38 18 Q28 18 28 28 Z"
          fill="var(--cmod-card)"
          stroke="var(--cmod-border)"
          strokeWidth="1.5"
        />
        <rect x="40" y="30" width="120" height="34" rx="4" fill="var(--cmod-surface)" opacity="0.9" />
        <rect x="48" y="38" width="48" height="4" rx="2" fill="var(--cmod-accent)" opacity="0.7" />
        <rect x="48" y="46" width="72" height="3" rx="1.5" fill="var(--cmod-border)" />
        <rect x="48" y="52" width="56" height="3" rx="1.5" fill="var(--cmod-border)" />
      </svg>
    </div>
  );
}
