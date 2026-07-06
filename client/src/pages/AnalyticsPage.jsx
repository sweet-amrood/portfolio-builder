import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardAnalytics from '../components/analytics/DashboardAnalytics';
import { analyticsAPI } from '../services/api';
import { formatSavedAt } from '../utils/builderPreviewDraft';
import '../styles/dashboard.css';
import '../styles/analytics.css';

function eventLabel(item) {
  if (item.type === 'visit') return 'Portfolio visit';
  if (item.type === 'message') return item.label === 'visitor-reply' ? 'Visitor reply' : 'New message';
  return item.label ? `Click: ${item.label}` : 'Click';
}

export default function AnalyticsPage() {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="dashboard-page analytics-page">
      <header className="dashboard-header">
        <div className="analytics-page-head">
          <div>
            <h1>Analytics</h1>
            <p>Full portfolio performance, visits, clicks, and messages.</p>
          </div>
          <Link to="/dashboard" className="btn-ghost">Back to dashboard</Link>
        </div>
      </header>

      <section className="dashboard-panel dashboard-panel--full">
        <DashboardAnalytics showRecent={false} />
      </section>

      <section className="dashboard-panel dashboard-panel--full">
        <div className="dashboard-panel-head">
          <h2>All events ({total})</h2>
        </div>

        {loading ? (
          <p className="dashboard-empty">Loading events…</p>
        ) : events.length ? (
          <>
            <div className="dashboard-activity-list analytics-events-table">
              {events.map((item) => (
                <div key={item.id} className="dashboard-activity-item">
                  <strong>{eventLabel(item)}</strong>
                  <span>{item.slug}</span>
                  <small>{formatSavedAt(item.createdAt)}</small>
                </div>
              ))}
            </div>
            <div className="analytics-pagination">
              <button type="button" className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                className="btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="dashboard-empty">No analytics events yet.</p>
        )}
      </section>
    </div>
  );
}
