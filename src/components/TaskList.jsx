import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // Note: You'll need to install this library

export default function TaskList({ title, tasks, onEdit, onDelete, onMoveNext, onMoveTo, headerAccentClass, id }) {
  const { setNodeRef } = useDroppable({
    id: `list-${id}`,
  });
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const taskIds = tasks.map(task => task.id);

  return (
    <section className="flex flex-col gap-4 bg-gray-50/50 rounded-2xl p-4 shadow-xl backdrop-blur-sm transition-all duration-300">
      <header className={`flex items-center justify-between bg-white rounded-xl border px-4 py-3 shadow-md ${headerAccentClass}`}>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div ref={setNodeRef} className={`flex flex-col gap-3 transition-max-height duration-500 ease-in-out ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-[1000px]'}`}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="text-sm text-gray-400 italic px-2 py-4 text-center animate-fade-in">No tasks here yet.</div>
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
        </SortableContext>
      </div>
    </section>
  );
}