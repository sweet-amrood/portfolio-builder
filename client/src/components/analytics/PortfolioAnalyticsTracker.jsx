import { useEffect, useRef } from 'react';
import { analyticsAPI } from '../../services/api';
import { getVisitorId, hasTrackedVisit, markVisitTracked } from '../../utils/portfolioAnalytics';

function clickLabel(target) {
  if (!target) return 'click';
  const href = target.getAttribute('href');
  if (href) return href.startsWith('#') ? `nav:${href.slice(1)}` : href;
  const text = target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 48);
  if (text) return text;
  const aria = target.getAttribute('aria-label');
  if (aria) return aria;
  return target.tagName.toLowerCase();
}

export default function PortfolioAnalyticsTracker({ slug }) {
  const clickTimerRef = useRef(null);

  useEffect(() => {
    if (!slug) return undefined;

    const trackVisit = async () => {
      if (hasTrackedVisit(slug)) return;
      try {
        const { data } = await analyticsAPI.track(slug, {
          type: 'visit',
          visitorId: getVisitorId(),
          label: 'portfolio-view',
        });
        if (data?.tracked !== false) {
          markVisitTracked(slug);
        }
      } catch {
      }
    };

    trackVisit();
    return undefined;
  }, [slug]);

  useEffect(() => {
    if (!slug) return undefined;

    let cleanup = null;
    let retryTimer = null;

    const bind = () => {
      const canvas = document.querySelector('.public-portfolio-canvas');
      if (!canvas) {
        retryTimer = window.setTimeout(bind, 300);
        return;
      }

      const handleClick = (event) => {
        const target = event.target.closest('a, button, [role="button"], input[type="submit"]');
        if (!target) return;
        if (target.closest('.portfolio-message-widget')) return;

        const label = clickLabel(target);
        if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);

        clickTimerRef.current = window.setTimeout(() => {
          analyticsAPI.track(slug, {
            type: 'click',
            label,
            visitorId: getVisitorId(),
          }).catch(() => {});
        }, 250);
      };

      canvas.addEventListener('click', handleClick);
      cleanup = () => canvas.removeEventListener('click', handleClick);
    };

    bind();

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      if (cleanup) cleanup();
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    };
  }, [slug]);

  return null;
}
