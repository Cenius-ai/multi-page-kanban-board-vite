/**
 * Generates a complete seeded dataset for first-launch demonstration.
 * Realistic content following cenius house style — no lorem ipsum, no placeholder names.
 */

let _counter = 0;
function uid(prefix = '') {
  _counter += 1;
  return `${prefix}${Date.now().toString(36)}${_counter.toString(36)}`;
}

export function generateSeedData() {
  const now = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const addDays = (d, n) => {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
  };

  // ---- Team Members ----
  const members = [
    {
      id: uid('m_'),
      name: 'Rahim Okafor',
      avatarUrl: '',
      role: 'Product Manager',
    },
    {
      id: uid('m_'),
      name: 'Sofia Chen',
      avatarUrl: '',
      role: 'Lead Developer',
    },
    {
      id: uid('m_'),
      name: 'Lena Kowalski',
      avatarUrl: '',
      role: 'QA Engineer',
    },
    {
      id: uid('m_'),
      name: 'Marcus Webb',
      avatarUrl: '',
      role: 'UX Designer',
    },
  ];

  // ---- Columns ----
  const colBacklog = { id: uid('c_'), title: 'Backlog', order: 0, taskIds: [] };
  const colTodo    = { id: uid('c_'), title: 'To Do',   order: 1, taskIds: [] };
  const colInProg  = { id: uid('c_'), title: 'In Progress', order: 2, taskIds: [] };
  const colReview  = { id: uid('c_'), title: 'Review',  order: 3, taskIds: [] };
  const colDone    = { id: uid('c_'), title: 'Done',    order: 4, taskIds: [] };

  const columns = [colBacklog, colTodo, colInProg, colReview, colDone];

  // ---- Tasks ----
  const taskDefs = [
    {
      title: 'Redesign onboarding flow',
      description:
        'Rework the 3-step sign-up wizard to reduce drop-off. Include email verification and a skip option. Reference the new brand palette.',
      column: colTodo,
      assigneeIdx: 3,
      priority: 'high',
      labels: ['design', 'onboarding'],
      dueOffset: 5,
    },
    {
      title: 'Fix search debounce on mobile',
      description:
        'The 300ms debounce is firing on every keystroke on iOS Safari. Investigate the event order and add a proper trailing-edge debounce.',
      column: colInProg,
      assigneeIdx: 1,
      priority: 'medium',
      labels: ['bug', 'mobile'],
      dueOffset: 2,
    },
    {
      title: 'Add CSV export for reports',
      description:
        'Users need to download their quarterly summary as CSV. Build the export endpoint and wire the "Download" button on /reports.',
      column: colBacklog,
      assigneeIdx: 1,
      priority: 'low',
      labels: ['feature', 'data'],
      dueOffset: 14,
    },
    {
      title: 'Update dependency: react-router to v7',
      description:
        'Audit breaking changes in the v7 changelog, update the package, and run the full regression suite before merging.',
      column: colBacklog,
      assigneeIdx: 1,
      priority: 'medium',
      labels: ['tech-debt'],
      dueOffset: 10,
    },
    {
      title: 'Write E2E tests for checkout flow',
      description:
        'Cover the happy path, expired-card error, and 3DS challenge using Playwright. Add to CI pipeline.',
      column: colInProg,
      assigneeIdx: 2,
      priority: 'high',
      labels: ['testing', 'checkout'],
      dueOffset: 4,
    },
    {
      title: 'Design dark mode tokens',
      description:
        'Extend the design-token system with a dark variant. Ensure WCAG AA contrast on all semantic roles.',
      column: colTodo,
      assigneeIdx: 3,
      priority: 'medium',
      labels: ['design', 'accessibility'],
      dueOffset: 8,
    },
    {
      title: 'Optimize image loading on landing page',
      description:
        'Lighthouse flags Largest Contentful Paint at 3.8s. Convert hero image to WebP, add srcset, and lazy-load below-fold images.',
      column: colTodo,
      assigneeIdx: 1,
      priority: 'medium',
      labels: ['performance'],
      dueOffset: 6,
    },
    {
      title: 'Investigate 502 spikes on payment webhook',
      description:
        'Datadog shows intermittent 502s from the payment provider between 14:00–14:10 UTC. Check logs and correlate with provider status page.',
      column: colInProg,
      assigneeIdx: 0,
      priority: 'high',
      labels: ['bug', 'payments', 'ops'],
      dueOffset: 1,
    },
    {
      title: 'Add bulk-edit for task priorities',
      description:
        'Shift-click or checkbox-select multiple tasks in the board and apply a priority change in one action.',
      column: colBacklog,
      assigneeIdx: 0,
      priority: 'low',
      labels: ['feature', 'ux'],
      dueOffset: 21,
    },
    {
      title: 'Ship v2.4 release notes',
      description:
        'Draft and publish the release notes for v2.4: new filters, CSV export, and the accessibility fixes.',
      column: colReview,
      assigneeIdx: 0,
      priority: 'medium',
      labels: ['docs', 'release'],
      dueOffset: 3,
    },
    {
      title: 'Refactor auth middleware',
      description:
        'Extract token verification into a shared middleware. Add request-id to every log line for tracing.',
      column: colDone,
      assigneeIdx: 0,
      priority: 'medium',
      labels: ['tech-debt', 'auth'],
      dueOffset: -3,
    },
    {
      title: 'Fix keyboard trap in modal dialogs',
      description:
        'Tab cycling escapes the modal and lands on background elements. Implement a focus trap with the inert attribute.',
      column: colReview,
      assigneeIdx: 2,
      priority: 'medium',
      labels: ['accessibility', 'bug'],
      dueOffset: 2,
    },
    {
      title: 'Set up feature flag for new dashboard',
      description:
        'Add a LaunchDarkly flag "new-dashboard-2025" gated to internal users. Wire it into the route guard.',
      column: colDone,
      assigneeIdx: 1,
      priority: 'low',
      labels: ['infra'],
      dueOffset: -5,
    },
    {
      title: 'Conduct usability study for filter panel',
      description:
        'Recruit 5 participants (internal). Task: apply a date-range filter and clear it. Record sessions and summarize findings.',
      column: colBacklog,
      assigneeIdx: 3,
      priority: 'low',
      labels: ['research', 'ux'],
      dueOffset: 30,
    },
  ];

  const tasks = taskDefs.map((def) => {
    const taskId = uid('t_');
    def.column.taskIds.push(taskId);
    return {
      id: taskId,
      columnId: def.column.id,
      title: def.title,
      description: def.description,
      dueDate: fmt(addDays(now, def.dueOffset)),
      assigneeId: members[def.assigneeIdx].id,
      priority: def.priority,
      labels: def.labels,
      createdAt: fmt(addDays(now, def.dueOffset < -2 ? def.dueOffset - 3 : -Math.abs(def.dueOffset) - 1)),
    };
  });

  // ---- Board ----
  const board = {
    id: uid('b_'),
    title: 'Cenius Product',
    columnIds: columns.map((c) => c.id),
  };

  // ---- Settings ----
  const settings = {
    boardBackground: '#ffffff',
    columnLimit: 0,
    defaultPriority: 'medium',
  };

  return {
    board,
    columns,
    tasks,
    members,
    settings,
  };
}
