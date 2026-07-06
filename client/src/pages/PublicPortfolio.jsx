import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TemplateRenderer from '../portfolio-templates/TemplateRenderer';
import { getTemplateById } from '../data/templates';
import { getThemeById } from '../constants/templateThemes';
import { portfolioAPI } from '../services/api';
import PortfolioMessageWidget from '../components/messaging/PortfolioMessageWidget';
import PortfolioAnalyticsTracker from '../components/analytics/PortfolioAnalyticsTracker';
import '../styles/messaging.css';

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setPortfolio(null);

      try {
        const { data } = await portfolioAPI.getPublic(slug);
        if (!active) return;
        setPortfolio(data);
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (slug) load();
    return () => {
      active = false;
    };
  }, [slug]);

  const template = useMemo(
    () => (portfolio?.templateId ? getTemplateById(portfolio.templateId) : null),
    [portfolio?.templateId]
  );

  const theme = useMemo(() => {
    if (!portfolio?.templateId || !portfolio?.themeId) return undefined;
    return getThemeById(portfolio.templateId, portfolio.themeId);
  }, [portfolio?.templateId, portfolio?.themeId]);

  if (loading) {
    return (
      <div className="public-portfolio-page">
        <div className="public-portfolio-state">Loading portfolio…</div>
      </div>
    );
  }

  if (notFound || !portfolio?.content || !template) {
    return (
      <div className="public-portfolio-page">
        <div className="public-portfolio-state">
          <h1>Portfolio not found</h1>
          <p>This portfolio is not published or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-portfolio-page">
      <div className="public-portfolio-canvas">
        <TemplateRenderer
          templateId={portfolio.templateId}
          preview
          content={portfolio.content}
          sectionOrder={portfolio.sectionOrder}
          theme={theme}
        />
      </div>
      <PortfolioMessageWidget slug={slug} ownerName={portfolio.ownerName} />
      <PortfolioAnalyticsTracker slug={slug} />
    </div>
  );
}
