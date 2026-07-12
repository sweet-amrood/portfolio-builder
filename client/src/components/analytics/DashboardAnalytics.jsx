import { useMemo, useState } from 'react';
import { FiActivity, FiEye, FiMessageSquare, FiMousePointer } from 'react-icons/fi';
import { useAnalytics } from '../../context/AnalyticsContext';
import { formatSavedAt } from '../../utils/builderPreviewDraft';

function MetricCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="dashboard-analytics-metric">
      <div className="dashboard-analytics-metric-top">
        <span>{label}</span>
        {Icon ? (
          <span className="dashboard-analytics-metric-icon">
            <Icon />
          </span>
        ) : null}
      </div>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}

function formatPeriodLabel(period, mode) {
  if (mode === 'monthly') {
    const [year, month] = period.split('-');
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric',
    });
  }
  if (mode === 'weekly') {
    return `Week of ${new Date(`${period}T00:00:00.000Z`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}`;
  }
  return new Date(`${period}T00:00:00.000Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

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

export default function DashboardAnalytics({ showRecent = true, compact = false }) {
  const { summary, loading } = useAnalytics();
  const [period, setPeriod] = useState('daily');

  const periodTotals = useMemo(() => {
    if (period === 'weekly') return summary.week;
    if (period === 'monthly') return summary.month;
    return summary.today;
  }, [period, summary]);

  const series = useMemo(() => {
    if (period === 'weekly') return summary.series.weekly;
    if (period === 'monthly') return summary.series.monthly;
    return summary.series.daily;
  }, [period, summary]);

  const maxValue = useMemo(() => {
    const values = series.flatMap((row) => [row.visits, row.clicks, row.messages]);
    return Math.max(1, ...values, 0);
  }, [series]);

  const chartSeries = compact ? series.slice(-7) : series;

  return (
    <div className={`dashboard-analytics${compact ? ' dashboard-analytics--compact' : ''}`}>
      <div className="dashboard-analytics-toolbar">
        <div className="dashboard-analytics-tabs" role="tablist" aria-label="Analytics period">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={period === tab}
              className={
                period === tab
                  ? 'dashboard-analytics-tab dashboard-analytics-tab--active'
                  : 'dashboard-analytics-tab'
              }
              onClick={() => setPeriod(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <span className={`dashboard-analytics-live${loading ? ' dashboard-analytics-live--busy' : ''}`}>
          {loading ? 'Updating…' : 'Live'}
        </span>
      </div>

      <div className="dashboard-analytics-metrics">
        <MetricCard
          label="Visits"
          value={periodTotals.visits}
          hint={period === 'daily' ? 'Today' : period}
          icon={FiEye}
        />
        <MetricCard
          label="Clicks"
          value={periodTotals.clicks}
          hint={period === 'daily' ? 'Today' : period}
          icon={FiMousePointer}
        />
        <MetricCard
          label="Messages"
          value={periodTotals.messages}
          hint={period === 'daily' ? 'Today' : period}
          icon={FiMessageSquare}
        />
        <MetricCard
          label="All-time visits"
          value={summary.totals.visits}
          hint="Total tracked"
          icon={FiActivity}
        />
      </div>

      <div className="dashboard-analytics-chart">
        {chartSeries.length ? (
          chartSeries.map((row) => {
            const key = row.date || row.period;
            const total = row.visits + row.clicks + row.messages;
            return (
              <div key={key} className="dashboard-analytics-bar-group">
                <div className="dashboard-analytics-bar-stack">
                  <span
                    className="dashboard-analytics-bar dashboard-analytics-bar--visits"
                    style={{ height: `${(row.visits / maxValue) * 100}%` }}
                    title={`Visits: ${row.visits}`}
                  />
                  <span
                    className="dashboard-analytics-bar dashboard-analytics-bar--clicks"
                    style={{ height: `${(row.clicks / maxValue) * 100}%` }}
                    title={`Clicks: ${row.clicks}`}
                  />
                  <span
                    className="dashboard-analytics-bar dashboard-analytics-bar--messages"
                    style={{ height: `${(row.messages / maxValue) * 100}%` }}
                    title={`Messages: ${row.messages}`}
                  />
                </div>
                <small>{formatPeriodLabel(key, period)}</small>
                <strong>{total}</strong>
              </div>
            );
          })
        ) : (
          <div className="dashboard-empty-state dashboard-empty-state--inline">
            <FiActivity />
            <p>No analytics yet. Share your live portfolio to start collecting visits.</p>
          </div>
        )}
      </div>

      <div className="dashboard-analytics-legend">
        <span>
          <i className="dashboard-analytics-dot dashboard-analytics-dot--visits" /> Visits
        </span>
        <span>
          <i className="dashboard-analytics-dot dashboard-analytics-dot--clicks" /> Clicks
        </span>
        <span>
          <i className="dashboard-analytics-dot dashboard-analytics-dot--messages" /> Messages
        </span>
      </div>

      {showRecent && summary.recent?.length ? (
        <div className="dashboard-analytics-feed">
          <h3>Recent analytics events</h3>
          <div className="dashboard-activity-list">
            {summary.recent.map((item) => (
              <div
                key={item.id}
                className={`dashboard-activity-item dashboard-activity-item--${eventTone(item.type)}`}
              >
                <span className={`dashboard-activity-dot dashboard-activity-dot--${eventTone(item.type)}`} />
                <div className="dashboard-activity-copy">
                  <strong>{eventLabel(item)}</strong>
                  <span>{item.slug}</span>
                </div>
                <small>{formatSavedAt(item.createdAt)}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
