// Shared component utilities

export function getMemberById(members, id) {
  if (!id || !members) return null;
  return members.find((m) => m.id === id) || null;
}

export function countTasksForMember(tasks, memberId) {
  return tasks.filter((t) => t.assigneeId === memberId).length;
}

export function countTasksInColumn(tasks, columnId) {
  return tasks.filter((t) => t.columnId === columnId).length;
}
