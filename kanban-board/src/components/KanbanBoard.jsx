import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column.jsx';
import TaskCard from './TaskCard.jsx';
import TaskForm from './TaskForm.jsx';
import Modal from './Modal.jsx';
import { useAppActions } from '../context/AppContext.jsx';

export default function KanbanBoard() {
  const { state, moveTask, addTask, editTask, deleteTask, addColumn, editColumn, deleteColumn } =
    useAppActions();

  const [addingToColumn, setAddingToColumn] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const columns = useMemo(() => {
    return state.board.columnIds.map((id) => state.columns[id]).filter(Boolean);
  }, [state.board.columnIds, state.columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  function handleDragStart(event) {
    const { active } = event;
    const task = state.tasks[active.id];
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const task = state.tasks[taskId];
    if (!task) return;

    let destColId;
    let newIndex;

    const overTask = state.tasks[over.id];
    if (overTask) {
      destColId = overTask.columnId;
    } else {
      destColId = over.id;
    }

    if (!destColId || !state.columns[destColId]) return;

    const destCol = state.columns[destColId];
    newIndex = destCol.taskIds.indexOf(over.id);
    if (newIndex === -1) newIndex = destCol.taskIds.length;

    if (task.columnId === destColId) {
      const currentIdx = destCol.taskIds.indexOf(taskId);
      if (currentIdx === newIndex || currentIdx === newIndex - 1) return;
    }

    moveTask(taskId, task.columnId, destColId, newIndex);
  }

  function handleAddTask(columnId, data) {
    addTask(columnId, data);
    setAddingToColumn(null);
  }

  function handleEditTask(taskId, updates) {
    editTask(taskId, updates);
    setEditingTask(null);
  }

  function handleEditColumnSave(columnId, title) {
    editColumn(columnId, title);
    setEditingColumn(null);
  }

  function handleAddColumn() {
    if (!newColumnTitle.trim()) return;
    addColumn(newColumnTitle.trim());
    setNewColumnTitle('');
  }

  return (
    <>
      <div className="board-header">
        <h2 className="board-title">{state.board.title}</h2>
        <div className="board-header__actions">
          <form
            className="board-add-col-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddColumn();
            }}
          >
            <input
              className="form-input board-col-input"
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="New column name"
              aria-label="New column name"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              + Column
            </button>
          </form>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <SortableContext items={state.board.columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                onAddTask={(colId) => setAddingToColumn(colId)}
                onEditTask={setEditingTask}
                onDeleteTask={deleteTask}
                onEditColumn={setEditingColumn}
                onDeleteColumn={deleteColumn}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask && (
            <div style={{ width: '280px', opacity: 0.85 }}>
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Modal open={addingToColumn !== null} onClose={() => setAddingToColumn(null)} title="Create task">
        <TaskForm
          columnId={addingToColumn}
          onSave={(data) => handleAddTask(addingToColumn, data)}
          onCancel={() => setAddingToColumn(null)}
        />
      </Modal>

      <Modal open={editingTask !== null} onClose={() => setEditingTask(null)} title="Edit task">
        {editingTask && (
          <>
            <TaskForm
              task={editingTask}
              columnId={editingTask.columnId}
              onSave={(data) => handleEditTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--s-4)', marginTop: 'var(--s-4)' }}>
              <button
                className="btn btn-danger-ghost"
                onClick={() => {
                  if (window.confirm('Delete this task?')) {
                    deleteTask(editingTask.id, editingTask.columnId);
                    setEditingTask(null);
                  }
                }}
              >
                Delete task
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={editingColumn !== null} onClose={() => setEditingColumn(null)} title="Rename column">
        {editingColumn && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              handleEditColumnSave(editingColumn.id, form.colName.value);
            }}
          >
            <div className="form-field">
              <label htmlFor="col-name" className="form-label">Column name</label>
              <input
                id="col-name"
                name="colName"
                className="form-input"
                type="text"
                defaultValue={editingColumn.title}
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEditingColumn(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
