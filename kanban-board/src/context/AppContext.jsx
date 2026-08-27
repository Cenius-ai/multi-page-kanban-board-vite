import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage, isSeeded, markSeeded } from '../utils/localStorage.js';
import { generateSeedData } from '../utils/seedData.js';

const AppContext = createContext(null);
const DispatchContext = createContext(null);

/* ---- action types ---- */
export const ACTIONS = {
  // Board
  MOVE_TASK: 'MOVE_TASK',
  MOVE_COLUMN: 'MOVE_COLUMN',
  ADD_TASK: 'ADD_TASK',
  EDIT_TASK: 'EDIT_TASK',
  DELETE_TASK: 'DELETE_TASK',
  ADD_COLUMN: 'ADD_COLUMN',
  EDIT_COLUMN: 'EDIT_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  // Team
  ADD_MEMBER: 'ADD_MEMBER',
  EDIT_MEMBER: 'EDIT_MEMBER',
  DELETE_MEMBER: 'DELETE_MEMBER',
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  // System
  RESET_ALL: 'RESET_ALL',
};

/* ---- helpers ---- */
let _idCounter = 0;
function uid(prefix = '') {
  _idCounter += 1;
  return `${prefix}${Date.now().toString(36)}${_idCounter.toString(36)}`;
}

function reorder(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/* ---- reducer ---- */
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE_TASK: {
      const { taskId, sourceColId, destColId, newIndex } = action.payload;
      const sourceCol = { ...state.columns[sourceColId], taskIds: [...state.columns[sourceColId].taskIds] };
      const sourceIdx = sourceCol.taskIds.indexOf(taskId);
      if (sourceIdx === -1) return state;

      sourceCol.taskIds.splice(sourceIdx, 1);
      const columns = { ...state.columns, [sourceColId]: sourceCol };

      if (sourceColId === destColId) {
        sourceCol.taskIds.splice(newIndex, 0, taskId);
      } else {
        const destCol = { ...state.columns[destColId], taskIds: [...state.columns[destColId].taskIds] };
        destCol.taskIds.splice(newIndex, 0, taskId);
        columns[destColId] = destCol;
        // Update the task's columnId
        const tasks = { ...state.tasks, [taskId]: { ...state.tasks[taskId], columnId: destColId } };
        return { ...state, columns, tasks };
      }
      return { ...state, columns };
    }

    case ACTIONS.MOVE_COLUMN: {
      const { columnId, newIndex } = action.payload;
      const columnIds = [...state.board.columnIds];
      const oldIdx = columnIds.indexOf(columnId);
      if (oldIdx === -1) return state;
      columnIds.splice(oldIdx, 1);
      columnIds.splice(newIndex, 0, columnId);
      return {
        ...state,
        board: { ...state.board, columnIds },
      };
    }

    case ACTIONS.ADD_TASK: {
      const { columnId, title, description, dueDate, assigneeId, priority, labels } = action.payload;
      const id = uid('t_');
      const task = {
        id,
        columnId,
        title,
        description: description || '',
        dueDate: dueDate || '',
        assigneeId: assigneeId || '',
        priority: priority || state.settings.defaultPriority,
        labels: labels || [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      const col = { ...state.columns[columnId], taskIds: [...state.columns[columnId].taskIds, id] };
      return {
        ...state,
        tasks: { ...state.tasks, [id]: task },
        columns: { ...state.columns, [columnId]: col },
      };
    }

    case ACTIONS.EDIT_TASK: {
      const { taskId, ...updates } = action.payload;
      const existing = state.tasks[taskId];
      if (!existing) return state;
      return { ...state, tasks: { ...state.tasks, [taskId]: { ...existing, ...updates } } };
    }

    case ACTIONS.DELETE_TASK: {
      const { taskId, columnId } = action.payload;
      const col = { ...state.columns[columnId], taskIds: state.columns[columnId].taskIds.filter((id) => id !== taskId) };
      const tasks = { ...state.tasks };
      delete tasks[taskId];
      return { ...state, tasks, columns: { ...state.columns, [columnId]: col } };
    }

    case ACTIONS.ADD_COLUMN: {
      const { title } = action.payload;
      const id = uid('c_');
      const column = { id, title, order: state.board.columnIds.length, taskIds: [] };
      return {
        ...state,
        columns: { ...state.columns, [id]: column },
        board: { ...state.board, columnIds: [...state.board.columnIds, id] },
      };
    }

    case ACTIONS.EDIT_COLUMN: {
      const { columnId, title } = action.payload;
      return { ...state, columns: { ...state.columns, [columnId]: { ...state.columns[columnId], title } } };
    }

    case ACTIONS.DELETE_COLUMN: {
      const { columnId } = action.payload;
      const columnIds = state.board.columnIds.filter((id) => id !== columnId);
      const columns = { ...state.columns };
      const tasks = { ...state.tasks };
      // Remove tasks in this column
      state.columns[columnId].taskIds.forEach((tid) => delete tasks[tid]);
      delete columns[columnId];
      return { ...state, columns, tasks, board: { ...state.board, columnIds } };
    }

    case ACTIONS.ADD_MEMBER: {
      const { name, role } = action.payload;
      const id = uid('m_');
      const member = { id, name, avatarUrl: '', role: role || '' };
      return { ...state, members: [...state.members, member] };
    }

    case ACTIONS.EDIT_MEMBER: {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      };
    }

    case ACTIONS.DELETE_MEMBER: {
      const { id } = action.payload;
      return { ...state, members: state.members.filter((m) => m.id !== id) };
    }

    case ACTIONS.UPDATE_SETTINGS: {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }

    case ACTIONS.RESET_ALL: {
      const seed = generateSeedData();
      return normalizeState(seed);
    }

    default:
      return state;
  }
}

/* ---- normalize seed data into lookup tables ---- */
function normalizeState(seed) {
  const columns = {};
  seed.columns.forEach((c) => (columns[c.id] = c));
  const tasks = {};
  seed.tasks.forEach((t) => (tasks[t.id] = t));
  return {
    board: seed.board,
    columns,
    tasks,
    members: seed.members,
    settings: seed.settings,
  };
}

function buildInitialState() {
  if (isSeeded()) {
    const board = loadFromStorage('board', null);
    const columns = loadFromStorage('columns', {});
    const tasks = loadFromStorage('tasks', {});
    const members = loadFromStorage('members', []);
    const settings = loadFromStorage('settings', { boardBackground: '#ffffff', columnLimit: 0, defaultPriority: 'medium' });
    if (board && Object.keys(columns).length > 0) {
      return { board, columns, tasks, members, settings };
    }
  }
  // First run — seed
  const seed = generateSeedData();
  markSeeded();
  return normalizeState(seed);
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, buildInitialState);

  // Persist on every change
  useEffect(() => {
    saveToStorage('board', state.board);
    saveToStorage('columns', state.columns);
    saveToStorage('tasks', state.tasks);
    saveToStorage('members', state.members);
    saveToStorage('settings', state.settings);
  }, [state]);

  return (
    <AppContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error('useDispatch must be used within AppProvider');
  return ctx;
}

/**
 * Convenience: returns memoized helpers for the most common operations.
 */
export function useAppActions() {
  const dispatch = useDispatch();
  const state = useAppState();

  const moveTask = useCallback(
    (taskId, sourceColId, destColId, newIndex) =>
      dispatch({ type: ACTIONS.MOVE_TASK, payload: { taskId, sourceColId, destColId, newIndex } }),
    [dispatch],
  );

  const moveColumn = useCallback(
    (columnId, newIndex) =>
      dispatch({ type: ACTIONS.MOVE_COLUMN, payload: { columnId, newIndex } }),
    [dispatch],
  );

  const addTask = useCallback(
    (columnId, data) => dispatch({ type: ACTIONS.ADD_TASK, payload: { columnId, ...data } }),
    [dispatch],
  );

  const editTask = useCallback(
    (taskId, updates) => dispatch({ type: ACTIONS.EDIT_TASK, payload: { taskId, ...updates } }),
    [dispatch],
  );

  const deleteTask = useCallback(
    (taskId, columnId) => dispatch({ type: ACTIONS.DELETE_TASK, payload: { taskId, columnId } }),
    [dispatch],
  );

  const addColumn = useCallback(
    (title) => dispatch({ type: ACTIONS.ADD_COLUMN, payload: { title } }),
    [dispatch],
  );

  const editColumn = useCallback(
    (columnId, title) => dispatch({ type: ACTIONS.EDIT_COLUMN, payload: { columnId, title } }),
    [dispatch],
  );

  const deleteColumn = useCallback(
    (columnId) => dispatch({ type: ACTIONS.DELETE_COLUMN, payload: { columnId } }),
    [dispatch],
  );

  const addMember = useCallback(
    (name, role) => dispatch({ type: ACTIONS.ADD_MEMBER, payload: { name, role } }),
    [dispatch],
  );

  const editMember = useCallback(
    (id, updates) => dispatch({ type: ACTIONS.EDIT_MEMBER, payload: { id, ...updates } }),
    [dispatch],
  );

  const deleteMember = useCallback(
    (id) => dispatch({ type: ACTIONS.DELETE_MEMBER, payload: { id } }),
    [dispatch],
  );

  const updateSettings = useCallback(
    (updates) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: updates }),
    [dispatch],
  );

  const resetAll = useCallback(() => dispatch({ type: ACTIONS.RESET_ALL }), [dispatch]);

  return {
    state,
    moveTask,
    moveColumn,
    addTask,
    editTask,
    deleteTask,
    addColumn,
    editColumn,
    deleteColumn,
    addMember,
    editMember,
    deleteMember,
    updateSettings,
    resetAll,
  };
}
