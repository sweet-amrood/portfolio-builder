import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiActivity,
  FiBarChart2,
  FiCheck,
  FiCopy,
  FiEdit3,
  FiExternalLink,
  FiEye,
  FiFolder,
  FiLayout,
  FiMessageSquare,
  FiMousePointer,
  FiSend,
  FiUser,
  FiZap,
} from 'react-icons/fi';
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
import DashboardAnalytics from '../components/analytics/DashboardAnalytics';
import { useMessaging } from '../context/MessagingContext';
import { useAnalytics } from '../context/AnalyticsContext';
import '../styles/dashboard.css';
import '../styles/messaging.css';
import '../styles/analytics.css';

function Panel({ title, icon: Icon, action, children, className = '' }) {
  return (
    <section className={`dashboard-panel${className ? ` ${className}` : ''}`}>
      <div className="dashboard-panel-head">
        <div className="dashboard-panel-title">
          {Icon ? <Icon /> : null}
          <h2>{title}</h2>
        </div>
        {action || null}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, hint, tone = 'default', icon: Icon }) {
  return (
    <article className={`dashboard-stat-card dashboard-stat-card--${tone}`}>
      <div className="dashboard-stat-top">
        <span className="dashboard-stat-label">{label}</span>
        {Icon ? (
          <span className="dashboard-stat-icon">
            <Icon />
          </span>
        ) : null}
      </div>
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
  const [copied, setCopied] = useState(false);

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
    return {
      done,
      total: checks.length,
      percent: Math.round((done / checks.length) * 100),
    };
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
  const liveUrl =
    live?.status === 'live' && portfolioState?.slug
      ? getPublicPortfolioUrl(portfolioState.slug)
      : null;

  const handleCopyUrl = async () => {
    if (!liveUrl) return;
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      toast.success('Portfolio URL copied');
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Could not copy URL');
    }
  };

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="dashboard-page">
      <motion.header
        className="dashboard-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="dashboard-hero-copy">
          <p className="dashboard-hero-kicker">Workspace</p>
          <h1>Welcome{firstName ? `, ${firstName}` : ''}</h1>
          <p>
            Track publishing health, visitor analytics, and messages from one place — then jump
            straight into the next action.
          </p>
          <div className="dashboard-hero-meta">
            <span className={`dashboard-status-pill dashboard-status-pill--${live ? 'live' : 'draft'}`}>
              {live ? 'Portfolio live' : 'Not published'}
            </span>
            <span className="dashboard-status-pill">
              {completion.percent}% profile ready
            </span>
            {unreadCount > 0 ? (
              <span className="dashboard-status-pill dashboard-status-pill--warn">
                {unreadCount} unread
              </span>
            ) : null}
          </div>
        </div>

        <div className="dashboard-hero-side">
          <div className="dashboard-completeness" role="status">
            <div className="dashboard-completeness-ring" style={{ '--pct': completion.percent }}>
              <div className="dashboard-completeness-ring-inner">
                <strong>{completion.percent}%</strong>
                <span>ready</span>
              </div>
            </div>
            <div className="dashboard-completeness-copy">
              <strong>
                {completion.done}/{completion.total} essentials
              </strong>
              <p>Profile content and publish readiness for stronger portfolios.</p>
            </div>
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/profile" className="dashboard-btn dashboard-btn--ghost">
              <FiUser />
              Edit profile
            </Link>
            <Link
              to="/builder"
              state={{ templateId: drafts[0]?.templateId || live?.templateId || 'lumen-bloom' }}
              className="dashboard-btn dashboard-btn--primary"
            >
              <FiZap />
              {live ? 'Update builder' : 'Open builder'}
            </Link>
          </div>
        </div>
      </motion.header>

      <section className="dashboard-stats-grid">
        <StatCard
          label="Portfolio status"
          value={portfolioStatus}
          hint={live ? 'Public-ready' : 'Needs publish'}
          tone={live ? 'success' : 'warn'}
          icon={FiSend}
        />
        <StatCard
          label="Visits today"
          value={analyticsSummary.today.visits}
          hint={`${analyticsSummary.week.visits} this week`}
          icon={FiEye}
        />
        <StatCard
          label="Clicks today"
          value={analyticsSummary.today.clicks}
          hint={`${analyticsSummary.month.clicks} this month`}
          icon={FiMousePointer}
        />
        <StatCard
          label="Messages today"
          value={analyticsSummary.today.messages}
          hint={`${conversationCount} conversations`}
          icon={FiMessageSquare}
        />
      </section>

      <section className="dashboard-stats-grid dashboard-stats-grid--secondary">
        <StatCard
          label="Completion"
          value={`${completion.percent}%`}
          hint="Profile + content readiness"
          icon={FiCheck}
        />
        <StatCard
          label="Published"
          value={analytics.totalPublished}
          hint={live ? '1 live, others archived' : 'Publish history'}
          icon={FiFolder}
        />
        <StatCard label="Drafts" value={analytics.totalDrafts} hint={draftStatus} icon={FiLayout} />
        <StatCard
          label="Unread"
          value={unreadCount}
          hint="Needs reply"
          tone={unreadCount ? 'warn' : 'default'}
          icon={FiMessageSquare}
        />
      </section>

      <section className="dashboard-quick-actions">
        <Link to="/templates" className="dashboard-quick-card">
          <FiLayout />
          <div>
            <strong>Browse templates</strong>
            <span>Start or switch designs</span>
          </div>
        </Link>
        <Link to="/dashboard/analytics" className="dashboard-quick-card">
          <FiBarChart2 />
          <div>
            <strong>Analytics hub</strong>
            <span>Visits, clicks, messages</span>
          </div>
        </Link>
        <Link to="/my-templates" className="dashboard-quick-card">
          <FiFolder />
          <div>
            <strong>My work</strong>
            <span>Drafts and saved builds</span>
          </div>
        </Link>
        <Link to="/profile" className="dashboard-quick-card">
          <FiUser />
          <div>
            <strong>Master profile</strong>
            <span>Reuse content everywhere</span>
          </div>
        </Link>
      </section>

      <div className="dashboard-layout">
        <Panel title="Portfolio URL" icon={FiExternalLink}>
          <div className="dashboard-url-box">
            <code>{loadingPortfolio ? 'Loading…' : portfolioUrl}</code>
            <div className="dashboard-url-actions">
              {liveUrl ? (
                <>
                  <button type="button" className="dashboard-btn dashboard-btn--ghost" onClick={handleCopyUrl}>
                    {copied ? <FiCheck /> : <FiCopy />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <a href={liveUrl} className="dashboard-btn dashboard-btn--ghost" target="_blank" rel="noreferrer">
                    <FiEye />
                    View live
                  </a>
                </>
              ) : (
                <Link
                  to="/builder"
                  state={{ templateId: drafts[0]?.templateId || 'lumen-bloom' }}
                  className="dashboard-btn dashboard-btn--primary"
                >
                  <FiSend />
                  Publish now
                </Link>
              )}
            </div>
          </div>
        </Panel>

        <Panel
          title="Performance snapshot"
          icon={FiBarChart2}
          action={
            <Link to="/dashboard/analytics" className="dashboard-panel-link">
              Manage analytics
            </Link>
          }
        >
          <DashboardAnalytics showRecent={false} compact />
        </Panel>

        <Panel
          title="Recent analytics"
          icon={FiActivity}
          action={
            <Link to="/dashboard/analytics" className="dashboard-panel-link">
              Open hub
            </Link>
          }
        >
          <AnalyticsRecentPanel />
        </Panel>

        <Panel title="Recent activity" icon={FiZap}>
          {recentActivity.length ? (
            <div className="dashboard-activity-list">
              {recentActivity.map((item, index) => {
                const templateName = getTemplateById(item.templateId)?.name || item.templateId;
                return (
                  <div key={`${item.kind}-${item.templateId}-${item.at}-${index}`} className="dashboard-activity-item">
                    <span className="dashboard-activity-dot" />
                    <div className="dashboard-activity-copy">
                      <strong>{item.kind}</strong>
                      <span>{templateName}</span>
                    </div>
                    <small>{formatSavedAt(item.at)}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <FiActivity />
              <p>No activity yet. Save a draft or publish to see it here.</p>
            </div>
          )}
        </Panel>

        <Panel title="Published templates" icon={FiFolder} className="dashboard-panel--full">
          {loadingPortfolio ? (
            <p className="dashboard-empty">Loading published portfolios…</p>
          ) : publishedHistory.length ? (
            <div className="dashboard-published-list">
              {publishedHistory.map((record) => {
                const template = getTemplateById(record.templateId);
                const name = record.content?.name || template?.name || record.templateId;
                const isLive = record.status === 'live';
                const viewUrl =
                  isLive && portfolioState?.slug ? getPublicPortfolioUrl(portfolioState.slug) : null;

                return (
                  <article
                    key={`${record.templateId}-${record.status}`}
                    className={`dashboard-published-item${isLive ? ' dashboard-published-item--live' : ''}`}
                  >
                    <div className="dashboard-published-copy">
                      <div className="dashboard-published-badges">
                        <span className={`dashboard-badge${isLive ? ' dashboard-badge--live' : ''}`}>
                          {isLive ? 'Live' : 'Archived'}
                        </span>
                      </div>
                      <h3>{name}</h3>
                      <p>{template?.name || record.templateId}</p>
                      <small>
                        {isLive ? 'Published' : 'Archived'}:{' '}
                        {formatSavedAt(isLive ? record.publishedAt : record.archivedAt || record.publishedAt)}
                      </small>
                    </div>
                    <div className="dashboard-published-actions">
                      {viewUrl ? (
                        <a href={viewUrl} className="dashboard-btn dashboard-btn--ghost" target="_blank" rel="noreferrer">
                          <FiEye />
                          View
                        </a>
                      ) : null}
                      <Link
                        to="/builder"
                        state={{ templateId: record.templateId }}
                        className="dashboard-btn dashboard-btn--ghost"
                      >
                        <FiEdit3 />
                        Edit
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <FiFolder />
              <p>No published templates yet. Publish from Builder to manage them here.</p>
              <Link
                to="/builder"
                state={{ templateId: drafts[0]?.templateId || 'lumen-bloom' }}
                className="dashboard-btn dashboard-btn--primary"
              >
                <FiSend />
                Go to builder
              </Link>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
