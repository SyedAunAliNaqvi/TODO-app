import React, { useEffect, useMemo, useState } from 'react';
import { loadTasks, saveTasks } from './utils/storage';
import TaskList from './components/TaskList';
import { DndContext, closestCorners, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskCard from './components/TaskCard';

const STATUSES = ['todo', 'inprogress', 'done'];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const lists = useMemo(() => {
    const listMap = { todo: [], inprogress: [], done: [] };
    tasks.forEach(t => listMap[t.status].push(t));
    return listMap;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) {
      alert('Title is required');
      return;
    }
    const task = {
      id: uid(),
      title,
      description: newDescription.trim() || '',
      status: 'todo',
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowAdd(false);
  };

  const editTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveNext = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const currentIndex = STATUSES.indexOf(t.status);
      const next = STATUSES[Math.min(currentIndex + 1, STATUSES.length - 1)];
      return { ...t, status: next };
    }));
  };

  const moveTo = (id, status) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const newTasks = [...tasks];
    const activeTask = newTasks.find(t => t.id === active.id);
    const overListId = over.id.includes('list-') ? over.id.replace('list-', '') : activeTask.status;

    if (activeTask.status === overListId) {
      const activeList = lists[activeTask.status];
      const overList = lists[overListId];
      const oldIndex = activeList.findIndex(t => t.id === active.id);
      const newIndex = overList.findIndex(t => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const movedTasks = arrayMove(activeList, oldIndex, newIndex);
        setTasks(prev => {
          const newState = prev.filter(t => t.status !== activeTask.status);
          return [...newState, ...movedTasks];
        });
      }
    } else {
      activeTask.status = overListId;
      setTasks(newTasks);
    }
    setActiveId(null);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const activeTask = useMemo(() => tasks.find(t => t.id === activeId), [activeId, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-in-out font-sans text-gray-800">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-shadow duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white grid place-content-center font-bold text-lg shadow-md">TL</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Trello Lite</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAdd(s => !s)}
              className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
              title="Add a new task"
            >
              {showAdd ? 'Close' : 'Add Task'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showAdd && (
          <div className="mb-8 bg-white rounded-3xl shadow-2xl p-6 grid gap-4 sm:grid-cols-2 animate-fade-in transition-all duration-300">
            <div className="sm:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Title *</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Implement login screen"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow duration-200"
                maxLength={120}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow duration-200"
                maxLength={1000}
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                onClick={addTask}
                className="rounded-full px-4 py-2 text-sm bg-blue-600 text-white shadow-md transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Add to "To Do"
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewTitle(''); setNewDescription(''); }}
                className="rounded-full px-4 py-2 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STATUSES.map(status => (
              <TaskList
                key={status}
                id={status}
                title={status.charAt(0).toUpperCase() + status.slice(1)}
                tasks={lists[status]}
                onEdit={editTask}
                onDelete={deleteTask}
                onMoveNext={moveNext}
                onMoveTo={moveTo}
                headerAccentClass={
                  status === 'todo'
                    ? 'border-blue-100'
                    : status === 'inprogress'
                      ? 'border-yellow-100'
                      : 'border-emerald-100'
                }
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <TaskCard
                task={tasks.find(t => t.id === activeId)}
                onEdit={editTask}
                onDelete={deleteTask}
                onMoveNext={moveNext}
                onMoveTo={moveTo}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <p className="mt-12 text-center text-sm text-gray-200">
          Data is stored locally in your browser via localStorage. Clearing site data will remove tasks.
        </p>
      </main>
    </div>
  );
}