import React from 'react'
import TaskCard from './TaskCard'

export default function TaskList({ title, tasks, onEdit, onDelete, onMoveNext, onMoveTo, headerAccentClass }) {
  return (
    <section className="flex flex-col gap-3">
      <header className={`flex items-center justify-between bg-white rounded-2xl border px-4 py-3 ${headerAccentClass}`}>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </header>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic px-2">No tasks here yet.</div>
        ) : (
          tasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveNext={onMoveNext}
              onMoveTo={onMoveTo}
            />
          ))
        )}
      </div>
    </section>
  )
}
