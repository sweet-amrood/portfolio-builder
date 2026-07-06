import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getTemplateById } from '../data/templates';
import { useAuth } from '../context/AuthContext';
import { loadLocalMasterProfile } from '../utils/masterProfileStorage';
import {
  listSavedPortfolioDrafts,
  formatSavedAt,
} from '../utils/builderPreviewDraft';
import { portfolioAPI } from '../services/api';
import { getPublicPortfolioUrl } from '../utils/portfolioSlug';
import AnalyticsRecentPanel from '../components/analytics/AnalyticsRecentPanel';
import { useMessaging } from '../context/MessagingContext';
import { useAnalytics } from '../context/AnalyticsContext';
import '../styles/dashboard.css';
import '../styles/messaging.css';
import '../styles/analytics.css';

function Panel({ title, children, className = '' }) {
  return (
    <section className={`dashboard-panel${className ? ` ${className}` : ''}`}>
      <div className="dashboard-panel-head">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`dashboard-stat-card dashboard-stat-card--${tone}`}>
      <span className="dashboard-stat-label">{label}</span>
      <strong className="dashboard-stat-value">{value}</strong>
      {hint ? <small className="dashboard-stat-hint">{hint}</small> : null}
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { unreadCount, conversationCount } = useMessaging();
  const { summary: analyticsSummary } = useAnalytics();
  const drafts = useMemo(() => listSavedPortfolioDrafts(), []);
  const profile = useMemo(() => loadLocalMasterProfile(user?.id), [user?.id]);
  const [portfolioState, setPortfolioState] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPortfolio = async () => {
      setLoadingPortfolio(true);
      try {
        const { data } = await portfolioAPI.getMine();
        if (active) setPortfolioState(data);
      } catch {
        if (active) setPortfolioState(null);
      } finally {
        if (active) setLoadingPortfolio(false);
      }
    };

    loadPortfolio();
    return () => {
      active = false;
    };
  }, []);

  const live = portfolioState?.live || null;
  const archived = portfolioState?.archived || [];
  const publishedHistory = useMemo(() => {
    const items = [...archived];
    if (live) items.unshift(live);
    return items;
  }, [live, archived]);

  const analytics = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const updatedLastWeek = drafts.filter((item) => (item.draft.savedAt || 0) >= weekAgo).length;
    const templateCounts = drafts.reduce((acc, item) => {
      acc[item.templateId] = (acc[item.templateId] || 0) + 1;
      return acc;
    }, {});

    return {
      totalDrafts: drafts.length,
      totalPublished: publishedHistory.length,
      updatedLastWeek,
      templatesUsed: Object.keys(templateCounts).length,
    };
  }, [drafts, publishedHistory.length]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile?.personal?.name),
      Boolean(profile?.personal?.headline || profile?.personal?.tagline),
      Boolean(profile?.links?.email),
      Boolean(profile?.skillGroups?.some((g) => g.items?.length)),
      Boolean(profile?.projects?.length),
      Boolean(profile?.experience?.length),
      Boolean(live),
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [profile, live]);

  const recentActivity = useMemo(() => {
    const items = [
      ...drafts.map(({ templateId, draft }) => ({
        kind: 'Draft Saved',
        templateId,
        at: draft.savedAt || 0,
      })),
      ...publishedHistory.map((record) => ({
        kind: record.status === 'live' ? 'Published (Live)' : 'Published (Archived)',
        templateId: record.templateId,
        at: record.publishedAt ? new Date(record.publishedAt).getTime() : 0,
      })),
    ]
      .sort((a, b) => b.at - a.at)
      .slice(0, 6);
    return items;
  }, [drafts, publishedHistory]);

  const draftStatus = drafts.length
    ? `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} saved`
    : 'No drafts saved yet';
  const portfolioStatus = live ? 'Live' : drafts.length ? 'In Progress' : 'Not Started';
  const portfolioUrl =
    portfolioState?.publicUrl ||
    (portfolioState?.slug ? getPublicPortfolioUrl(portfolioState.slug) : 'Not published yet');

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
        <p>Control your portfolio health, publishing, and activity from one workspace.</p>
      </header>

      <section className="dashboard-stats-grid">
        <StatCard
          label="Portfolio Status"
          value={portfolioStatus}
          hint={live ? 'Public-ready' : 'Needs publish'}
          tone={live ? 'success' : 'warn'}
        />
        <StatCard label="Visits Today" value={analyticsSummary.today.visits} hint={`${analyticsSummary.week.visits} this week`} />
        <StatCard label="Clicks Today" value={analyticsSummary.today.clicks} hint={`${analyticsSummary.month.clicks} this month`} />
        <StatCard label="Messages Today" value={analyticsSummary.today.messages} hint={`${conversationCount} conversations`} />
      </section>

      <section className="dashboard-stats-grid dashboard-stats-grid--secondary">
        <StatCard label="Completion Progress" value={`${completion}%`} hint="Profile + content readiness" />
        <StatCard
          label="Published Templates"
          value={analytics.totalPublished}
          hint={live ? '1 live, others archived' : 'Publish history'}
        />
        <StatCard label="Draft Status" value={analytics.totalDrafts} hint={draftStatus} />
        <StatCard label="Unread Messages" value={unreadCount} hint="Needs reply" tone={unreadCount ? 'warn' : 'default'} />
      </section>

      <div className="dashboard-layout">
        <Panel title="Portfolio URL">
          <div className="dashboard-url-row">
            <code>{loadingPortfolio ? 'Loading…' : portfolioUrl}</code>
            {live?.status === 'live' && portfolioState?.slug ? (
              <a
                href={getPublicPortfolioUrl(portfolioState.slug)}
                className="btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                View Live
              </a>
            ) : (
              <Link to="/builder" state={{ templateId: drafts[0]?.templateId || 'lumen-bloom' }} className="btn-ghost">
                Publish Now
              </Link>
            )}
          </div>
        </Panel>

        <Panel title="Recent Analytics">
          <AnalyticsRecentPanel />
        </Panel>

        <Panel title="Recent Activity">
          {recentActivity.length ? (
            <div className="dashboard-activity-list">
              {recentActivity.map((item, index) => {
                const templateName = getTemplateById(item.templateId)?.name || item.templateId;
                return (
                  <div key={`${item.kind}-${item.templateId}-${item.at}-${index}`} className="dashboard-activity-item">
                    <strong>{item.kind}</strong>
                    <span>{templateName}</span>
                    <small>{formatSavedAt(item.at)}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="dashboard-empty">No activity yet.</p>
          )}
        </Panel>

        <Panel title="Published Templates" className="dashboard-panel--full">
          {loadingPortfolio ? (
            <p className="dashboard-empty">Loading published portfolios…</p>
          ) : publishedHistory.length ? (
            <div className="dashboard-published-list">
              {publishedHistory.map((record) => {
                const template = getTemplateById(record.templateId);
                const name = record.content?.name || template?.name || record.templateId;
                const isLive = record.status === 'live';
                const viewUrl = isLive && portfolioState?.slug
                  ? getPublicPortfolioUrl(portfolioState.slug)
                  : null;

                return (
                  <article key={`${record.templateId}-${record.status}`} className="dashboard-published-item">
                    <div>
                      <h3>{name}</h3>
                      <p>
                        {template?.name || record.templateId}
                        {isLive ? ' · Live' : ' · Archived'}
                      </p>
                      <small>
                        {isLive ? 'Published' : 'Archived'}: {formatSavedAt(
                          isLive ? record.publishedAt : record.archivedAt || record.publishedAt
                        )}
                      </small>
                    </div>
                    <div className="dashboard-published-actions">
                      {viewUrl ? (
                        <a href={viewUrl} className="btn-ghost" target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : null}
                      <Link to="/builder" state={{ templateId: record.templateId }} className="btn-ghost">
                        Edit
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="dashboard-empty">No published templates yet. Publish from Builder to see them here.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
