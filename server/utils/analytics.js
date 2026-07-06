import PortfolioAnalyticsEvent from '../models/PortfolioAnalyticsEvent.js';
import PortfolioAnalyticsDaily from '../models/PortfolioAnalyticsDaily.js';
import { emitToOwner } from '../socket.js';

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function counterField(type) {
  if (type === 'visit') return 'visits';
  if (type === 'click') return 'clicks';
  return 'messages';
}

function sumRows(rows) {
  return rows.reduce(
    (acc, row) => ({
      visits: acc.visits + (row.visits || 0),
      clicks: acc.clicks + (row.clicks || 0),
      messages: acc.messages + (row.messages || 0),
    }),
    { visits: 0, clicks: 0, messages: 0 }
  );
}

function weekKey(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() - day + 1);
  return dateKey(copy);
}

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export async function recordAnalyticsEvent({ ownerId, slug, type, label = '', visitorId = '' }) {
  if (type === 'visit' && visitorId) {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await PortfolioAnalyticsEvent.findOne({
      owner: ownerId,
      slug,
      type: 'visit',
      visitorId,
      createdAt: { $gte: thirtyMinAgo },
    }).select('_id');

    if (recentVisit) {
      return { deduped: true };
    }
  }

  const today = dateKey();
  const field = counterField(type);

  await PortfolioAnalyticsDaily.findOneAndUpdate(
    { owner: ownerId, date: today },
    { $inc: { [field]: 1 } },
    { upsert: true, new: true }
  );

  const event = await PortfolioAnalyticsEvent.create({
    owner: ownerId,
    slug,
    type,
    label: String(label || '').slice(0, 200),
    visitorId: String(visitorId || '').slice(0, 80),
  });

  const summary = await getAnalyticsSummary(ownerId);
  emitToOwner(String(ownerId), 'analytics:update', summary);

  return { event: event.toFeedObject(), summary };
}

export async function getAnalyticsSummary(ownerId) {
  const today = dateKey();
  const weekStart = weekKey();
  const monthStart = monthKey();

  const dailyRows = await PortfolioAnalyticsDaily.find({ owner: ownerId })
    .sort({ date: -1 })
    .limit(90)
    .lean();

  const todayRow = dailyRows.find((row) => row.date === today) || {
    visits: 0,
    clicks: 0,
    messages: 0,
  };

  const weekRows = dailyRows.filter((row) => row.date >= weekStart);
  const monthRows = dailyRows.filter((row) => row.date >= `${monthStart}-01`);

  const totals = sumRows(dailyRows);
  const week = sumRows(weekRows);
  const month = sumRows(monthRows);

  const dailySeries = [...dailyRows]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((row) => ({
      date: row.date,
      visits: row.visits,
      clicks: row.clicks,
      messages: row.messages,
    }));

  const weeklyMap = new Map();
  for (const row of dailyRows) {
    const key = weekKey(new Date(`${row.date}T00:00:00.000Z`));
    const current = weeklyMap.get(key) || { period: key, visits: 0, clicks: 0, messages: 0 };
    current.visits += row.visits;
    current.clicks += row.clicks;
    current.messages += row.messages;
    weeklyMap.set(key, current);
  }

  const monthlyMap = new Map();
  for (const row of dailyRows) {
    const key = row.date.slice(0, 7);
    const current = monthlyMap.get(key) || { period: key, visits: 0, clicks: 0, messages: 0 };
    current.visits += row.visits;
    current.clicks += row.clicks;
    current.messages += row.messages;
    monthlyMap.set(key, current);
  }

  const weeklySeries = [...weeklyMap.values()]
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-8);

  const monthlySeries = [...monthlyMap.values()]
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-6);

  const recent = await PortfolioAnalyticsEvent.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  return {
    totals,
    today: {
      visits: todayRow.visits || 0,
      clicks: todayRow.clicks || 0,
      messages: todayRow.messages || 0,
    },
    week,
    month,
    series: {
      daily: dailySeries,
      weekly: weeklySeries,
      monthly: monthlySeries,
    },
    recent: recent.map((row) => ({
      id: row._id,
      type: row.type,
      label: row.label,
      slug: row.slug,
      createdAt: row.createdAt,
    })),
  };
}

export async function getAnalyticsEvents(ownerId, { page = 1, limit = 25 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 25));
  const skip = (safePage - 1) * safeLimit;

  const [events, total] = await Promise.all([
    PortfolioAnalyticsEvent.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    PortfolioAnalyticsEvent.countDocuments({ owner: ownerId }),
  ]);

  return {
    events: events.map((row) => ({
      id: row._id,
      type: row.type,
      label: row.label,
      slug: row.slug,
      createdAt: row.createdAt,
    })),
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
}
