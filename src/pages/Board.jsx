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
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAppContext } from '../context/AppContext';
import Column from '../components/Column';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

let idCounter = 0;
function makeId(prefix) {
  idCounter += 1;
  return `${prefix}${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export default function Board() {
  const {
    board,
    tasks,
    members,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumnTitle,
    deleteColumn,
    reorderColumns,
  } = useAppContext();

  const [activeTask, setActiveTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showColDeleteConfirm, setShowColDeleteConfirm] = useState(false);
  const [colToDelete, setColToDelete] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const columns = useMemo(
    () => [...board.columns].sort((a, b) => a.order - b.order),
    [board.columns]
  );

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  // ---- Drag handlers ----
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    // Column reorder
    if (active.data.current?.type === 'column') {
      const oldIdx = columns.findIndex((c) => c.id === active.id);
      const newIdx = columns.findIndex((c) => c.id === over.id);
      if (oldIdx !== newIdx && oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(columns, oldIdx, newIdx).map((c, i) => ({
          ...c,
          order: i,
        }));
        reorderColumns(reordered);
      }
      return;
    }

    // Task move: find the target column
    let targetColId = null;
    if (over.data.current?.column) {
      targetColId = over.data.current.column.id;
    } else if (over.data.current?.task) {
      targetColId = over.data.current.task.columnId;
    }

    if (!targetColId) return;

    moveTask(active.id, targetColId);

  };

  // ---- Task CRUD ----
  const openAddTask = (columnId) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTargetColumnId(null);
    setModalOpen(true);
  };

  const handleSaveTask = (data) => {
    if (editingTask) {
      updateTask({ ...data, id: editingTask.id });
    } else {
      addTask({ id: makeId('t_'), columnId: targetColumnId, ...data });
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // ---- Column CRUD ----
  const handleAddColumn = () => {
    const title = newColTitle.trim();
    if (!title) return;
    addColumn({ id: makeId('c_'), title });
    setNewColTitle('');
    setAddingColumn(false);
  };

  const confirmDeleteColumn = () => {
    if (colToDelete) {
      deleteColumn(colToDelete);
      setColToDelete(null);
      setShowColDeleteConfirm(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{board.title || 'Kanban Board'}</h1>
        <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
          {addingColumn ? (
            <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
              <input
                className="field-input"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColumn();
                  if (e.key === 'Escape') setAddingColumn(false);
                }}
                placeholder="Column name"
                autoFocus
                style={{ width: 160 }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddColumn}>Add</button>
              <button className="btn btn-sm" onClick={() => setAddingColumn(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn" onClick={() => setAddingColumn(true)}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="9" y1="3" x2="9" y2="15" />
                <line x1="3" y1="9" x2="15" y2="9" />
              </svg>
              Add column
            </button>
          )}
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No columns yet</div>
          <div className="empty-state-desc">
            Create your first column to start organizing tasks.
          </div>
          <button className="btn btn-primary" onClick={() => setAddingColumn(true)}>
            Create column
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-board">
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  members={members}
                  onAddTask={openAddTask}
                  onEditTask={openEditTask}
                  onDeleteTask={(t) => { setTaskToDelete(t); setShowDeleteConfirm(true); }}
                  onDeleteColumn={(id) => { setColToDelete(id); setShowColDeleteConfirm(true); }}
                  onUpdateTitle={updateColumnTitle}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div style={{ width: 280 }}>
                <TaskCard
                  task={activeTask}
                  members={members}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task create/edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit task' : 'New task'}
      >
        <TaskForm
          initial={editingTask}
          members={members}
          onSave={handleSaveTask}
          onCancel={() => { setModalOpen(false); setEditingTask(null); }}
        />
      </Modal>

      {/* Delete task confirmation */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete task"
        footer={
          <>
            <button className="btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDeleteTask}>Delete</button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
          Are you sure you want to delete &ldquo;{taskToDelete?.title}&rdquo;? This action cannot be undone.
        </p>
      </Modal>

      {/* Delete column confirmation */}
      <Modal
        open={showColDeleteConfirm}
        onClose={() => setShowColDeleteConfirm(false)}
        title="Delete column"
        footer={
          <>
            <button className="btn" onClick={() => setShowColDeleteConfirm(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDeleteColumn}>Delete column &amp; tasks</button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
          This will delete the column and all tasks inside it. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
