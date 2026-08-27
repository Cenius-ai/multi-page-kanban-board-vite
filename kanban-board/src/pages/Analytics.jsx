import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAppState } from '../context/AppContext.jsx';

const STATUS_COLORS = {
  high: '#CC3B37',
  medium: '#D98A1A',
  low: '#6B7280',
};

const ACCENT = '#009367';

const CHART_COLORS = ['#009367', '#4A90D9', '#D98A1A', '#CC3B37', '#8E5EA6', '#6B7280', '#D97A4A'];

export default function Analytics() {
  const state = useAppState();
  const tasks = Object.values(state.tasks);

  const stats = useMemo(() => {
    // Tasks per column
    const perColumn = state.board.columnIds.map((cid) => {
      const col = state.columns[cid];
      return {
        name: col?.title || cid,
        count: col?.taskIds.length || 0,
      };
    });

    // Tasks per priority
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
    });
    const perPriority = Object.entries(priorityCounts).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val,
      color: STATUS_COLORS[key] || '#6B7280',
    }));

    // Tasks per assignee
    const memberMap = {};
    state.members.forEach((m) => (memberMap[m.id] = m));
    const assigneeCounts = {};
    tasks.forEach((t) => {
      if (t.assigneeId) {
        const name = memberMap[t.assigneeId]?.name || 'Unassigned';
        assigneeCounts[name] = (assigneeCounts[name] || 0) + 1;
      }
    });
    const unassigned = tasks.filter((t) => !t.assigneeId).length;
    const perAssignee = Object.entries(assigneeCounts).map(([name, count]) => ({
      name,
      count,
    }));
    if (unassigned > 0) {
      perAssignee.push({ name: 'Unassigned', count: unassigned });
    }

    // Overdue
    const doneCol = Object.values(state.columns).find((c) => c.title === 'Done');
    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false;
      if (t.columnId === doneCol?.id) return false;
      return new Date(t.dueDate) < now;
    }).length;

    // Completed
    const completed = doneCol ? doneCol.taskIds.length : 0;

    return {
      total: tasks.length,
      perColumn,
      perPriority,
      perAssignee,
      overdue,
      completed,
    };
  }, [state, tasks]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Analytics</h2>
      </div>

      {/* Summary cards */}
      <div className="analytics-summary">
        <div className="analytics-card">
          <span className="analytics-card__value">{stats.total}</span>
          <span className="analytics-card__label">Total tasks</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-card__value">{stats.completed}</span>
          <span className="analytics-card__label">Completed</span>
        </div>
        <div className="analytics-card analytics-card--warn">
          <span className="analytics-card__value">{stats.overdue}</span>
          <span className="analytics-card__label">Overdue</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-card__value">{state.members.length}</span>
          <span className="analytics-card__label">Team members</span>
        </div>
      </div>

      <div className="analytics-charts">
        {/* Bar: Tasks per column */}
        <div className="chart-container">
          <h4 className="chart-title">Tasks by Status</h4>
          {stats.perColumn.length === 0 ? (
            <div className="empty-state"><p>No data yet.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.perColumn} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-20)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--fg-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: 'var(--fg-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    fontSize: 'var(--fs-sm)',
                  }}
                />
                <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie: Priority distribution */}
        <div className="chart-container">
          <h4 className="chart-title">Priority Distribution</h4>
          {stats.perPriority.every((p) => p.value === 0) ? (
            <div className="empty-state"><p>No tasks to analyze.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.perPriority}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                >
                  {stats.perPriority.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    fontSize: 'var(--fs-sm)',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Workload by assignee */}
      <div className="chart-container" style={{ marginTop: 'var(--s-6)' }}>
        <h4 className="chart-title">Workload by Assignee</h4>
        {stats.perAssignee.length === 0 ? (
          <div className="empty-state"><p>No assignments yet.</p></div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={stats.perAssignee}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-20)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: 'var(--fg-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: 'var(--fg)' }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  fontSize: 'var(--fs-sm)',
                }}
              />
              <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
