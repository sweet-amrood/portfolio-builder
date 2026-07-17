import { Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HiChartBarSquare,
  HiChatBubbleLeftRight,
  HiGlobeAlt,
  HiDocumentText,
  HiPaintBrush,
  HiRocketLaunch,
  HiArrowRight,
} from 'react-icons/hi2';
import BrandLogo from '../components/BrandLogo';
import useLenis from '../hooks/useLenis';
import '../styles/home.css';

const FuturisticHeroCanvas = lazy(() => import('../components/hero/FuturisticHeroCanvas'));

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: '01',
    title: 'Pick a template',
    desc: 'Start from polished layouts built for developers, designers, and creatives.',
  },
  {
    step: '02',
    title: 'Customize every section',
    desc: 'Edit content, colors, and structure in the visual builder — no code required.',
  },
  {
    step: '03',
    title: 'Publish with your slug',
    desc: 'Go live on a clean URL like yours.com/yourname with one click.',
  },
  {
    step: '04',
    title: 'Track and connect',
    desc: 'Monitor visits, clicks, and messages from your dashboard in real time.',
  },
];

const features = [
  {
    icon: HiPaintBrush,
    title: 'Visual Builder',
    desc: 'Drag-and-drop sections, live preview, and theme controls in one workspace.',
  },
  {
    icon: HiDocumentText,
    title: 'Resume Import',
    desc: 'Upload your resume and auto-fill profile, skills, projects, and experience.',
  },
  {
    icon: HiGlobeAlt,
    title: 'Live Portfolio URL',
    desc: 'Publish to a memorable slug and share a single link that always stays current.',
  },
  {
    icon: HiChartBarSquare,
    title: 'Real-time Analytics',
    desc: 'See visits, link clicks, and message activity as they happen.',
  },
  {
    icon: HiChatBubbleLeftRight,
    title: 'Visitor Messaging',
    desc: 'Let recruiters and clients reach you directly from your live portfolio.',
  },
  {
    icon: HiRocketLaunch,
    title: 'Instant Deploy',
    desc: 'Push updates live without redeploying code or managing hosting.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: 'easeOut' },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  useLenis(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      const heroCopy = document.querySelector('.home-hero-copy');
      if (heroCopy) {
        gsap.set(heroCopy, { autoAlpha: 1, y: 0 });
      }

      gsap.fromTo(
        '.home-hero-copy',
        { autoAlpha: 1, y: 0 },
        {
          autoAlpha: 0,
          y: -56,
          ease: 'none',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: '.home-hero-section--fullbleed',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        '.home-page-rest',
        { y: 56 },
        {
          y: 0,
          ease: 'none',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: '.home-hero-section--fullbleed',
            start: '20% top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  const handleCardSelect = (templateId) => {
    navigate('/builder', { state: { templateId } });
  };

  return (
    <div className="home-page">
      <section className="home-hero-section home-hero-section--fullbleed">
        <div className="home-hero-stage" aria-hidden="true">
          <Suspense fallback={<div className="futuristic-hero-fallback futuristic-hero-fallback--full" />}>
            <FuturisticHeroCanvas fullBleed onCardSelect={handleCardSelect} />
          </Suspense>
        </div>

        <div className="home-hero-scrim" aria-hidden="true" />

        <div className="home-hero home-hero--fullbleed">
          <div className="home-hero-copy">
            <BrandLogo size="lg" variant="full" showText={false} className="home-hero-brand" />

            <h1 className="home-hero-title">
              Forge a portfolio that
              <span className="gradient-text"> wins attention</span>
            </h1>

            <p className="home-hero-desc">
              Templates, visual editing, live publishing, analytics, and visitor chat —
              in one cinematic workspace.
            </p>

            <p className="home-hero-hint">Hover the live templates on the right · click to open the builder</p>

            <div className="home-hero-actions">
              <motion.button
                type="button"
                className="btn-primary btn-large"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/builder')}
              >
                Start Building
                <HiArrowRight size={18} />
              </motion.button>
              <motion.button
                type="button"
                className="btn-secondary btn-large"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/templates')}
              >
                Browse Templates
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <div className="home-page-rest">
        <div className="home-page-bg" aria-hidden="true">
          <span className="home-page-grid" />
        </div>

        <section className="home-steps">
          <motion.div
            className="home-section-head"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>From idea to live site in four steps</h2>
            <p>A streamlined workflow designed for speed without sacrificing quality.</p>
          </motion.div>

          <div className="home-steps-grid">
            {steps.map((item, i) => (
              <motion.article
                key={item.step}
                className="home-step-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="home-step-num">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="home-features">
          <motion.div
            className="home-section-head"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Everything built in</h2>
            <p>Not just templates — a complete platform to launch and grow your presence.</p>
          </motion.div>

          <div className="home-features-grid">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  className="home-feature-card"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <span className="home-feature-icon">
                    <Icon size={22} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="home-cta">
          <motion.div
            className="home-cta-card"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <BrandLogo size="lg" variant="full" className="home-cta-logo" />
            <h2>Ready to forge your portfolio?</h2>
            <p>Open the builder, pick a template, and publish your first live page today.</p>
            <motion.button
              type="button"
              className="btn-primary btn-large"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/builder')}
            >
              Create Your Portfolio
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
