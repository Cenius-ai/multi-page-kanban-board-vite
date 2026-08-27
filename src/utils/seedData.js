/**
 * Seed data for FlowBoard.
 * Generates a default board, 3 columns, 10 tasks, and 2 team members.
 * Only seeds if localStorage is empty (first visit).
 */

let idCounter = 0;
function uid(prefix = '') {
  idCounter += 1;
  return `${prefix}${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export function generateSeedData() {
  idCounter = 0;

  const members = [
    {
      id: uid('m_'),
      name: 'Alex Chen',
      role: 'Product Manager',
      avatarUrl: '',
      initials: 'AC',
    },
    {
      id: uid('m_'),
      name: 'Jordan Reyes',
      role: 'Developer',
      avatarUrl: '',
      initials: 'JR',
    },
  ];

  const memberIds = members.map((m) => m.id);

  const columns = [
    { id: uid('c_'), title: 'Backlog', order: 0 },
    { id: uid('c_'), title: 'In Progress', order: 1 },
    { id: uid('c_'), title: 'Done', order: 2 },
  ];

  const now = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const daysFromNow = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return fmt(d);
  };

  // 10 tasks distributed across the 3 columns
  const tasks = [
    {
      id: uid('t_'),
      columnId: columns[0].id,
      title: 'Research competitor pricing models',
      description:
        'Compile a spreadsheet of competitor pricing tiers, feature sets, and positioning for Q3 update.',
      dueDate: daysFromNow(5),
      assigneeId: memberIds[0],
      priority: 'medium',
      labels: ['research', 'strategy'],
    },
    {
      id: uid('t_'),
      columnId: columns[0].id,
      title: 'Draft user onboarding flow v2',
      description:
        'Sketch wireframes for the revised onboarding flow targeting under 4 minutes time-to-value.',
      dueDate: daysFromNow(8),
      assigneeId: memberIds[0],
      priority: 'high',
      labels: ['ux', 'design'],
    },
    {
      id: uid('t_'),
      columnId: columns[0].id,
      title: 'Set up error monitoring dashboard',
      description:
        'Configure Sentry project and wire up the frontend SDK with a shared Grafana dashboard.',
      dueDate: daysFromNow(3),
      assigneeId: memberIds[1],
      priority: 'low',
      labels: ['devops'],
    },
    {
      id: uid('t_'),
      columnId: columns[0].id,
      title: 'Plan team offsite agenda',
      description:
        'Draft a 2-day offsite agenda covering Q3 retro and Q4 planning sessions.',
      dueDate: daysFromNow(10),
      assigneeId: memberIds[0],
      priority: 'low',
      labels: ['planning'],
    },
    {
      id: uid('t_'),
      columnId: columns[1].id,
      title: 'Implement drag-and-drop task reordering',
      description:
        'Add sortable context so users can reorder tasks within a column and move them between columns.',
      dueDate: daysFromNow(2),
      assigneeId: memberIds[1],
      priority: 'high',
      labels: ['frontend', 'core'],
    },
    {
      id: uid('t_'),
      columnId: columns[1].id,
      title: 'Build analytics dashboard endpoint',
      description:
        'Create GET endpoint returning task counts by status, assignee workload, and weekly trends.',
      dueDate: daysFromNow(4),
      assigneeId: memberIds[1],
      priority: 'medium',
      labels: ['backend', 'api'],
    },
    {
      id: uid('t_'),
      columnId: columns[1].id,
      title: 'Write unit tests for auth module',
      description:
        'Cover login, registration, token refresh, and password reset flows. Target 85% coverage.',
      dueDate: daysFromNow(1),
      assigneeId: memberIds[1],
      priority: 'medium',
      labels: ['testing'],
    },
    {
      id: uid('t_'),
      columnId: columns[1].id,
      title: 'Update design system color tokens',
      description:
        'Migrate all components to the new OKLCH-based token system with dark mode variants.',
      dueDate: daysFromNow(6),
      assigneeId: memberIds[0],
      priority: 'low',
      labels: ['design-system'],
    },
    {
      id: uid('t_'),
      columnId: columns[2].id,
      title: 'Ship homepage redesign',
      description:
        'Deployed new homepage with updated hero, social proof, and revised CTA at 50/50 A/B split.',
      dueDate: daysFromNow(-3),
      assigneeId: memberIds[0],
      priority: 'high',
      labels: ['launch', 'design'],
    },
    {
      id: uid('t_'),
      columnId: columns[2].id,
      title: 'Database index optimization',
      description:
        'Added composite index on (tenant_id, created_at). Query time dropped from 2.1s to 14ms.',
      dueDate: daysFromNow(-5),
      assigneeId: memberIds[1],
      priority: 'medium',
      labels: ['performance', 'database'],
    },
  ];

  const board = {
    id: uid('b_'),
    title: 'FlowBoard Q4 Sprint',
    columns,
  };

  const settings = {
    boardBackground: '#ffffff',
    columnLimit: 10,
    defaultPriority: 'medium',
  };

  return { board, tasks, members, settings };
}
