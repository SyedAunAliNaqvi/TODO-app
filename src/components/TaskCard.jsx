import React, { useState } from 'react'

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
}

export default function TaskCard({ task, onEdit, onDelete, onMoveNext, onMoveTo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')

  const nextLabel = task.status === 'todo' ? 'Move to In Progress' 
                    : task.status === 'inprogress' ? 'Move to Done' 
                    : null

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return alert('Title is required')
    onEdit(task.id, { title: trimmed, description })
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow">
      {!isEditing ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-semibold text-gray-800">{task.title}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              {STATUS_LABELS[task.status]}
            </span>
          </div>
          {task.description ? (
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
          ) : (
            <p className="mt-2 text-sm italic text-gray-400">No description</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nextLabel && (
              <button
                onClick={() => onMoveNext(task.id)}
                className="text-sm rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                title={nextLabel}
              >
                {nextLabel}
              </button>
            )}
            {task.status === 'done' && (
              <button
                onClick={() => onMoveTo(task.id, 'inprogress')}
                className="text-sm rounded-xl px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Move back to In Progress"
              >
                Move to In Progress
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="ml-auto text-sm rounded-xl px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              title="Edit task"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this task? This cannot be undone.')) onDelete(task.id)
              }}
              className="text-sm rounded-xl px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details..."
              maxLength={1000}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="text-sm rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setTitle(task.title)
                setDescription(task.description || '')
              }}
              className="text-sm rounded-xl px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
