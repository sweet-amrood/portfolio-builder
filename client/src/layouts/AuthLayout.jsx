import { useEffect } from 'react';
import BrandLogo from '../components/BrandLogo';
import { motion } from 'framer-motion';
import PortfolioMosaicBg from '../components/PortfolioMosaicBg';

export default function AuthLayout() {
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div className="auth-page">
      <PortfolioMosaicBg />

      <div className="auth-container">
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BrandLogo to="/login" size="lg" variant="full" className="auth-brand-logo" />
          <p className="brand-tagline">Craft your digital identity</p>
        </motion.div>

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
