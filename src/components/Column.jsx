import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { countTasksInColumn } from './utils';

export default function Column({ column, tasks, members, onAddTask, onEditTask, onDeleteTask, onDeleteColumn, onUpdateTitle }) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: column.id, data: { type: 'column', column } });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: column.id, data: { column } });

  const columnTasks = tasks.filter((t) => t.columnId === column.id);
  const taskIds = columnTasks.map((t) => t.id);
  const count = countTasksInColumn(tasks, column.id);

  const [editingTitle, setEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(column.title);

  React.useEffect(() => {
    setTitleValue(column.title);
  }, [column.title]);

  const handleTitleSave = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateTitle(column.id, trimmed);
    }
    setEditingTitle(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const setRefs = (node) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  return (
    <div className="kanban-column" ref={setRefs} style={style} {...attributes}>
      <div className="kanban-column-header" {...listeners}>
        {editingTitle ? (
          <input
            className="field-input"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            autoFocus
            style={{ fontSize: '0.8125rem', padding: '2px 6px', width: '140px' }}
          />
        ) : (
          <div className="kanban-column-title">
            <span
              onClick={() => setEditingTitle(true)}
              style={{ cursor: 'pointer' }}
              title="Click to rename"
            >
              {column.title}
            </span>
            <span className="kanban-column-count">{count}</span>
          </div>
        )}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteColumn(column.id);
          }}
          title="Delete column"
          style={{ width: 26, height: 26, color: 'var(--muted)' }}
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="9" x2="12" y2="9" />
          </svg>
        </button>
      </div>

      <div className={`kanban-column-body${isOver ? ' drag-over' : ''}`}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              members={members}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        {columnTasks.length === 0 && (
          <div style={{
            padding: 'var(--s-6) var(--s-3)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--muted)',
          }}>
            No tasks yet
          </div>
        )}
      </div>

      <div className="kanban-column-footer">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onAddTask(column.id)}
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="3" x2="9" y2="15" />
            <line x1="3" y1="9" x2="15" y2="9" />
          </svg>
          Add task
        </button>
      </div>
    </div>
  );
}
