import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowLeft,
  FiEye,
  FiFilter,
  FiMessageSquare,
  FiMousePointer,
  FiRefreshCw,
} from 'react-icons/fi';
import DashboardAnalytics from '../components/analytics/DashboardAnalytics';
import { analyticsAPI } from '../services/api';
import { formatSavedAt } from '../utils/builderPreviewDraft';
import { useAnalytics } from '../context/AnalyticsContext';
import '../styles/dashboard.css';
import '../styles/analytics.css';

function eventLabel(item) {
  if (item.type === 'visit') return 'Portfolio visit';
  if (item.type === 'message') return item.label === 'visitor-reply' ? 'Visitor reply' : 'New message';
  return item.label ? `Click: ${item.label}` : 'Click';
}

function eventTone(type) {
  if (type === 'visit') return 'visit';
  if (type === 'message') return 'message';
  return 'click';
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'visit', label: 'Visits' },
  { id: 'click', label: 'Clicks' },
  { id: 'message', label: 'Messages' },
];

export default function AnalyticsPage() {
  const { summary, refreshSummary, loading: summaryLoading } = useAnalytics();
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await analyticsAPI.getEvents(page, 25);
        if (!active) return;
        setEvents(data.events || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch {
        if (!active) return;
        setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [page]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((item) => item.type === filter);
  }, [events, filter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSummary();
      const { data } = await analyticsAPI.getEvents(page, 25);
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="dashboard-page analytics-page">
      <motion.header
        className="dashboard-hero analytics-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="dashboard-hero-copy">
          <p className="dashboard-hero-kicker">Analytics management</p>
          <h1>Portfolio performance</h1>
          <p>
            Monitor visits, clicks, and messages in real time — then dig into every tracked event.
          </p>
          <div className="dashboard-hero-meta">
            <span className="dashboard-status-pill">
              <FiEye /> {summary.totals.visits} all-time visits
            </span>
            <span className="dashboard-status-pill">
              <FiMousePointer /> {summary.totals.clicks} clicks
            </span>
            <span className="dashboard-status-pill">
              <FiMessageSquare /> {summary.totals.messages} messages
            </span>
          </div>
        </div>
        <div className="dashboard-hero-side analytics-hero-actions">
          <button
            type="button"
            className="dashboard-btn dashboard-btn--ghost"
            onClick={handleRefresh}
            disabled={refreshing || summaryLoading}
          >
            <FiRefreshCw className={refreshing ? 'analytics-spin' : undefined} />
            {refreshing ? 'Refreshing…' : 'Refresh data'}
          </button>
          <Link to="/dashboard" className="dashboard-btn dashboard-btn--primary">
            <FiArrowLeft />
            Back to dashboard
          </Link>
        </div>
      </motion.header>

      <section className="dashboard-stats-grid">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">Today visits</span>
            <span className="dashboard-stat-icon">
              <FiEye />
            </span>
          </div>
          <strong className="dashboard-stat-value">{summary.today.visits}</strong>
          <small className="dashboard-stat-hint">{summary.week.visits} this week</small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">Today clicks</span>
            <span className="dashboard-stat-icon">
              <FiMousePointer />
            </span>
          </div>
          <strong className="dashboard-stat-value">{summary.today.clicks}</strong>
          <small className="dashboard-stat-hint">{summary.month.clicks} this month</small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">Today messages</span>
            <span className="dashboard-stat-icon">
              <FiMessageSquare />
            </span>
          </div>
          <strong className="dashboard-stat-value">{summary.today.messages}</strong>
          <small className="dashboard-stat-hint">{summary.week.messages} this week</small>
        </article>
        <article className="dashboard-stat-card dashboard-stat-card--success">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">All-time visits</span>
            <span className="dashboard-stat-icon">
              <FiActivity />
            </span>
          </div>
          <strong className="dashboard-stat-value">{summary.totals.visits}</strong>
          <small className="dashboard-stat-hint">Lifetime tracked</small>
        </article>
      </section>

      <section className="dashboard-panel dashboard-panel--full">
        <div className="dashboard-panel-head">
          <div className="dashboard-panel-title">
            <FiActivity />
            <h2>Trends & breakdown</h2>
          </div>
        </div>
        <DashboardAnalytics showRecent={false} />
      </section>

      <section className="dashboard-panel dashboard-panel--full">
        <div className="dashboard-panel-head">
          <div className="dashboard-panel-title">
            <FiFilter />
            <h2>Event log ({total})</h2>
          </div>
          <div className="analytics-filter-tabs">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`analytics-filter-tab${filter === item.id ? ' analytics-filter-tab--active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="dashboard-empty">Loading events…</p>
        ) : filteredEvents.length ? (
          <>
            <div className="dashboard-activity-list analytics-events-table">
              {filteredEvents.map((item) => (
                <div
                  key={item.id}
                  className={`dashboard-activity-item dashboard-activity-item--${eventTone(item.type)}`}
                >
                  <span className={`dashboard-activity-dot dashboard-activity-dot--${eventTone(item.type)}`} />
                  <div className="dashboard-activity-copy">
                    <strong>{eventLabel(item)}</strong>
                    <span>{item.slug}</span>
                  </div>
                  <span className={`analytics-type-chip analytics-type-chip--${eventTone(item.type)}`}>
                    {item.type}
                  </span>
                  <small>{formatSavedAt(item.createdAt)}</small>
                </div>
              ))}
            </div>
            <div className="analytics-pagination">
              <button
                type="button"
                className="dashboard-btn dashboard-btn--ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="dashboard-btn dashboard-btn--ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <FiActivity />
            <p>
              {filter === 'all'
                ? 'No analytics events yet.'
                : `No ${filter} events on this page.`}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
