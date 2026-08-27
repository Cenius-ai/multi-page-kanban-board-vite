import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../utils/localStorage';
import { generateSeedData } from '../utils/seedData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  board: 'board',
  tasks: 'tasks',
  members: 'members',
  settings: 'settings',
  seeded: 'seeded',
};

function initialState() {
  const wasSeeded = loadState(STORAGE_KEYS.seeded, false);
  if (!wasSeeded) {
    const seed = generateSeedData();
    saveState(STORAGE_KEYS.board, seed.board);
    saveState(STORAGE_KEYS.tasks, seed.tasks);
    saveState(STORAGE_KEYS.members, seed.members);
    saveState(STORAGE_KEYS.settings, seed.settings);
    saveState(STORAGE_KEYS.seeded, true);
    return {
      board: seed.board,
      tasks: seed.tasks,
      members: seed.members,
      settings: seed.settings,
    };
  }
  return {
    board: loadState(STORAGE_KEYS.board, { id: '', title: '', columns: [] }),
    tasks: loadState(STORAGE_KEYS.tasks, []),
    members: loadState(STORAGE_KEYS.members, []),
    settings: loadState(STORAGE_KEYS.settings, { boardBackground: '#ffffff', columnLimit: 10, defaultPriority: 'medium' }),
  };
}

function reducer(state, action) {
  switch (action.type) {
    // ---- Board ----
    case 'UPDATE_BOARD_TITLE': {
      const board = { ...state.board, title: action.payload };
      return { ...state, board };
    }

    // ---- Columns ----
    case 'ADD_COLUMN': {
      const maxOrder = state.board.columns.reduce((m, c) => Math.max(m, c.order), -1);
      const newCol = { id: action.payload.id, title: action.payload.title, order: maxOrder + 1 };
      const board = { ...state.board, columns: [...state.board.columns, newCol] };
      return { ...state, board };
    }

    case 'UPDATE_COLUMN_TITLE': {
      const columns = state.board.columns.map((c) =>
        c.id === action.payload.id ? { ...c, title: action.payload.title } : c
      );
      const board = { ...state.board, columns };
      return { ...state, board };
    }

    case 'DELETE_COLUMN': {
      const columns = state.board.columns.filter((c) => c.id !== action.payload);
      const tasks = state.tasks.filter((t) => t.columnId !== action.payload);
      const board = { ...state.board, columns };
      return { ...state, board, tasks };
    }

    case 'REORDER_COLUMNS': {
      const board = { ...state.board, columns: action.payload };
      return { ...state, board };
    }

    // ---- Tasks ----
    case 'ADD_TASK': {
      const tasks = [...state.tasks, action.payload];
      return { ...state, tasks };
    }

    case 'UPDATE_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, tasks };
    }

    case 'DELETE_TASK': {
      const tasks = state.tasks.filter((t) => t.id !== action.payload);
      return { ...state, tasks };
    }

    case 'MOVE_TASK': {
      const { taskId, targetColumnId } = action.payload;
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId: targetColumnId } : t
      );
      return { ...state, tasks };
    }

    // ---- Members ----
    case 'ADD_MEMBER': {
      const members = [...state.members, action.payload];
      return { ...state, members };
    }

    case 'UPDATE_MEMBER': {
      const members = state.members.map((m) =>
        m.id === action.payload.id ? { ...m, ...action.payload } : m
      );
      return { ...state, members };
    }

    case 'DELETE_MEMBER': {
      const members = state.members.filter((m) => m.id !== action.payload);
      const tasks = state.tasks.map((t) =>
        t.assigneeId === action.payload ? { ...t, assigneeId: '' } : t
      );
      return { ...state, members, tasks };
    }

    // ---- Settings ----
    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.payload };
      return { ...state, settings };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => { saveState(STORAGE_KEYS.board, state.board); }, [state.board]);
  useEffect(() => { saveState(STORAGE_KEYS.tasks, state.tasks); }, [state.tasks]);
  useEffect(() => { saveState(STORAGE_KEYS.members, state.members); }, [state.members]);
  useEffect(() => { saveState(STORAGE_KEYS.settings, state.settings); }, [state.settings]);

  const addTask = useCallback((task) => dispatch({ type: 'ADD_TASK', payload: task }), []);
  const updateTask = useCallback((task) => dispatch({ type: 'UPDATE_TASK', payload: task }), []);
  const deleteTask = useCallback((id) => dispatch({ type: 'DELETE_TASK', payload: id }), []);
  const moveTask = useCallback((taskId, targetColumnId) =>
    dispatch({ type: 'MOVE_TASK', payload: { taskId, targetColumnId } }), []);

  const addColumn = useCallback((col) => dispatch({ type: 'ADD_COLUMN', payload: col }), []);
  const updateColumnTitle = useCallback((id, title) =>
    dispatch({ type: 'UPDATE_COLUMN_TITLE', payload: { id, title } }), []);
  const deleteColumn = useCallback((id) => dispatch({ type: 'DELETE_COLUMN', payload: id }), []);
  const reorderColumns = useCallback((cols) => dispatch({ type: 'REORDER_COLUMNS', payload: cols }), []);

  const addMember = useCallback((m) => dispatch({ type: 'ADD_MEMBER', payload: m }), []);
  const updateMember = useCallback((m) => dispatch({ type: 'UPDATE_MEMBER', payload: m }), []);
  const deleteMember = useCallback((id) => dispatch({ type: 'DELETE_MEMBER', payload: id }), []);

  const updateSettings = useCallback((s) => dispatch({ type: 'UPDATE_SETTINGS', payload: s }), []);

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumnTitle,
    deleteColumn,
    reorderColumns,
    addMember,
    updateMember,
    deleteMember,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}
