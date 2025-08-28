import React, { useEffect, useMemo, useState } from 'react'
import TaskList from './components/TaskList'
import { loadTasks, saveTasks } from './utils/storage'

const STATUSES = ['todo', 'inprogress', 'done']

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const lists = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    inprogress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
  }), [tasks])

  const addTask = () => {
    const title = newTitle.trim()
    if (!title) {
      alert('Title is required')
      return
    }
    const task = {
      id: uid(),
      title,
      description: newDescription.trim() || '',
      status: 'todo',
      createdAt: Date.now(),
    }
    setTasks(prev => [task, ...prev])
    setNewTitle('')
    setNewDescription('')
    setShowAdd(false)
  }

  const editTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const moveNext = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const currentIndex = STATUSES.indexOf(t.status)
      const next = STATUSES[Math.min(currentIndex + 1, STATUSES.length - 1)]
      return { ...t, status: next }
    }))
  }

  const moveTo = (id, status) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)))
  }

  return (
   <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-blue-400 hover:via-green-500 hover:to-yellow-500 transition-all duration-700">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white grid place-content-center font-bold">TL</div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Trello Lite</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAdd(s => !s)}
              className="rounded-xl px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              title="Add a new task"
            >
              {showAdd ? 'Close' : 'Add Task'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Add Task Panel */}
        {showAdd && (
          <div className="mb-6 bg-white rounded-2xl shadow p-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Title *</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Implement login screen"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                maxLength={1000}
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                onClick={addTask}
                className="rounded-xl px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Add to "To Do"
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewTitle(''); setNewDescription('') }}
                className="rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <TaskList
            title="To Do"
            tasks={lists.todo}
            onEdit={editTask}
            onDelete={deleteTask}
            onMoveNext={moveNext}
            onMoveTo={moveTo}
            headerAccentClass="border-blue-100"
          />
          <TaskList
            title="In Progress"
            tasks={lists.inprogress}
            onEdit={editTask}
            onDelete={deleteTask}
            onMoveNext={moveNext}
            onMoveTo={moveTo}
            headerAccentClass="border-yellow-100"
          />
          <TaskList
            title="Done"
            tasks={lists.done}
            onEdit={editTask}
            onDelete={deleteTask}
            onMoveNext={moveNext}
            onMoveTo={moveTo}
            headerAccentClass="border-emerald-100"
          />
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Data is stored locally in your browser via localStorage. Clearing site data will remove tasks.
        </p>
      </main>
    </div>
  )
}
