import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { analyticsAPI } from '../../services/api';
import { formatSavedAt } from '../../utils/builderPreviewDraft';

const DEFAULT_VISIBLE = 10;
const EXPANDED_LIMIT = 25;

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

export default function AnalyticsRecentPanel() {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await analyticsAPI.getEvents(1, EXPANDED_LIMIT);
        if (active) setEvents(data.events || []);
      } catch {
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const visibleEvents = expanded ? events : events.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="analytics-recent-panel">
      {loading ? (
        <p className="dashboard-empty">Loading analytics…</p>
      ) : visibleEvents.length ? (
        <div className="dashboard-activity-list analytics-recent-list">
          {visibleEvents.map((item) => (
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
      ) : (
        <div className="dashboard-empty-state dashboard-empty-state--inline">
          <FiActivity />
          <p>No analytics events yet.</p>
        </div>
      )}

      <div className="analytics-recent-actions">
        {events.length > DEFAULT_VISIBLE ? (
          <button
            type="button"
            className="dashboard-btn dashboard-btn--ghost dashboard-btn--sm"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
            {expanded ? 'Show less' : `Show all ${Math.min(events.length, EXPANDED_LIMIT)}`}
          </button>
        ) : (
          <span />
        )}
        <Link to="/dashboard/analytics" className="analytics-recent-more">
          View full analytics
        </Link>
      </div>
    </div>
  );
}
