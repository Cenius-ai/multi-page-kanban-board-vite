import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableTask from './DraggableTask.jsx';
import { useAppState } from '../context/AppContext.jsx';

export default function Column({ column, onAddTask, onEditTask, onDeleteTask, onEditColumn, onDeleteColumn }) {
  const state = useAppState();
  const tasks = useMemo(
    () => column.taskIds.map((id) => state.tasks[id]).filter(Boolean),
    [column.taskIds, state.tasks],
  );

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={`column${isOver ? ' column--over' : ''}`}>
      <div className="column__header">
        <div className="column__title-row">
          <h3 className="column__title">{column.title}</h3>
          <span className="column__count">{tasks.length}</span>
        </div>
        <div className="column__actions">
          <button
            className="column__action-btn"
            onClick={() => onEditColumn(column)}
            title="Rename column"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {column.title !== 'Backlog' && column.title !== 'To Do' && column.title !== 'In Progress' && column.title !== 'Review' && column.title !== 'Done' && (
            <button
              className="column__action-btn column__action-btn--danger"
              onClick={() => {
                if (window.confirm(`Delete column "${column.title}" and all its tasks?`)) {
                  onDeleteColumn(column.id);
                }
              }}
              title="Delete column"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div ref={setNodeRef} className="column__body">
        <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DraggableTask key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="column__empty">No tasks yet</div>
        )}
      </div>

      <button className="column__add-btn" onClick={() => onAddTask(column.id)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add task
      </button>
    </div>
  );
}
