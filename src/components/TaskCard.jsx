import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete, onMoveNext, onMoveTo, isDragging }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const nextLabel = task.status === 'todo' ? 'Move to In Progress'
    : task.status === 'inprogress' ? 'Move to Done'
      : null;

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return alert('Title is required');
    onEdit(task.id, { title: trimmed, description });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-2xl shadow-md p-4 transition-all duration-300 ${isDragging ? 'shadow-2xl ring-4 ring-blue-500 opacity-80' : 'hover:shadow-lg hover:scale-[1.01] transform'}`}
    >
      {!isEditing ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-semibold text-gray-800">{task.title}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 animate-fade-in">
              {STATUS_LABELS[task.status]}
            </span>
          </div>
          {task.description ? (
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap animate-fade-in">{task.description}</p>
          ) : (
            <p className="mt-2 text-sm italic text-gray-400 animate-fade-in">No description</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nextLabel && (
              <button
                onClick={(e) => { e.stopPropagation(); onMoveNext(task.id); }}
                className="text-sm rounded-full px-3 py-2 bg-blue-600 text-white shadow-md transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
                title={nextLabel}
              >
                {nextLabel}
              </button>
            )}
            {task.status === 'done' && (
              <button
                onClick={(e) => { e.stopPropagation(); onMoveTo(task.id, 'inprogress'); }}
                className="text-sm rounded-full px-3 py-2 bg-indigo-600 text-white shadow-md transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Move back to In Progress"
              >
                Move to In Progress
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="ml-auto text-sm rounded-full px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              title="Edit task"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this task? This cannot be undone.')) onDelete(task.id);
              }}
              className="text-sm rounded-full px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3 animate-fade-in">
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
              className="text-sm rounded-full px-3 py-2 bg-blue-600 text-white shadow-md transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }}
              className="text-sm rounded-full px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}