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
import { useAppContext } from '../context/AppContext';

const ACCENT_HEX = '#009367';

const PRIORITY_COLORS = {
  high: '#d1453b',
  medium: '#d9a40e',
  low: ACCENT_HEX,
};

const STATUS_COLORS = [ACCENT_HEX, '#5b9bd5', '#d9a40e', '#8c8c8c'];

export default function Analytics() {
  const { tasks, members, board } = useAppContext();

  // Task count by column
  const tasksByColumn = useMemo(() => {
    return board.columns.map((col) => ({
      name: col.title,
      count: tasks.filter((t) => t.columnId === col.id).length,
    }));
  }, [tasks, board.columns]);

  // Task count by priority
  const tasksByPriority = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) counts[t.priority]++;
    });
    return [
      { name: 'High', value: counts.high, color: PRIORITY_COLORS.high },
      { name: 'Medium', value: counts.medium, color: PRIORITY_COLORS.medium },
      { name: 'Low', value: counts.low, color: PRIORITY_COLORS.low },
    ].filter((d) => d.value > 0);
  }, [tasks]);

  // Tasks per member
  const tasksByMember = useMemo(() => {
    return members
      .map((m) => ({
        name: m.name.split(' ')[0],
        count: tasks.filter((t) => t.assigneeId === m.id).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [tasks, members]);

  // Overdue tasks
  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate + 'T00:00:00');
      return due < today;
    }).length;
  }, [tasks]);

  const totalTasks = tasks.length;
  const doneCol = board.columns.find((c) => c.title === 'Done' || c.title.toLowerCase() === 'done');
  const doneCount = doneCol ? tasks.filter((t) => t.columnId === doneCol.id).length : 0;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No data yet</div>
          <div className="empty-state-desc">
            Create tasks on the board to see analytics and charts here.
          </div>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'var(--s-4)',
              marginBottom: 'var(--s-6)',
            }}
          >
            <div className="stat-card">
              <div className="stat-card-title">Total Tasks</div>
              <div className="stat-card-value">{totalTasks}</div>
              <div className="stat-card-sub">Across {board.columns.length} columns</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Completed</div>
              <div className="stat-card-value">{doneCount}</div>
              <div className="stat-card-sub">{completionRate}% completion rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Overdue</div>
              <div className="stat-card-value" style={overdueCount > 0 ? { color: 'var(--danger)' } : undefined}>
                {overdueCount}
              </div>
              <div className="stat-card-sub">Past due date</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Team Members</div>
              <div className="stat-card-value">{members.length}</div>
              <div className="stat-card-sub">Active contributors</div>
            </div>
          </div>

          {/* Charts */}
          <div className="analytics-grid">
            {/* Tasks by Column */}
            <div className="stat-card">
              <div className="stat-card-title" style={{ marginBottom: 'var(--s-4)' }}>
                Tasks by Status
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={tasksByColumn} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--n-200)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'var(--muted)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: 'var(--muted)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Bar dataKey="count" fill={ACCENT_HEX} radius={[4, 4, 0, 0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tasks by Priority */}
            <div className="stat-card">
              <div className="stat-card-title" style={{ marginBottom: 'var(--s-4)' }}>
                Tasks by Priority
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {tasksByPriority.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: 'var(--fg)', fontSize: '0.75rem' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tasks per Member */}
            <div className="stat-card">
              <div className="stat-card-title" style={{ marginBottom: 'var(--s-4)' }}>
                Workload by Assignee
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={tasksByMember}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--n-200)" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: 'var(--muted)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'var(--fg)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Bar dataKey="count" fill={ACCENT_HEX} radius={[0, 4, 4, 0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Completion progress */}
            <div className="stat-card">
              <div className="stat-card-title" style={{ marginBottom: 'var(--s-4)' }}>
                Completion Progress
              </div>
              <div style={{ padding: 'var(--s-4) 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{completionRate}% complete</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {doneCount} / {totalTasks} tasks
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'var(--surface-alt)',
                    borderRadius: 'var(--r-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${completionRate}%`,
                      background: ACCENT_HEX,
                      borderRadius: 'var(--r-full)',
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>
                {/* Column breakdown */}
                <div style={{ marginTop: 'var(--s-4)', display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                  {tasksByColumn.map((col, i) => (
                    <div key={col.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: STATUS_COLORS[i % STATUS_COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', flex: 1 }}>{col.name}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-strong)' }}>
                        {col.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
