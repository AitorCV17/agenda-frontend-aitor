import React, { useState } from 'react'
import axios from '../services/api'
import TaskForm from './TaskForm'
import ShareTaskListModal from './ShareTaskListModal'

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  starred: boolean
}

interface TaskList {
  id: number
  name: string
  pinned: boolean
  tasks: Task[]
}

interface TaskListItemProps {
  list: TaskList
  onRefresh: () => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ list, onRefresh }) => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleDeleteList = async () => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return
    try {
      await axios.delete(`/tasks/lists/${list.id}`)
      onRefresh()
    } catch {
      console.error('Error al eliminar la lista')
    }
  }

  // Elimina o edita tareas de manera similar…
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await axios.delete(`/tasks/lists/${list.id}/tasks/${taskId}`)
      onRefresh()
    } catch {
      console.error('Error al eliminar la tarea')
    }
  }

  // ... Funciones para togglear, editar tareas, etc.

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">
          {list.pinned && <span className="mr-2 text-yellow-500">📌</span>}
          {list.name}
        </h3>
        <div>
          <button onClick={() => setShowShareModal(true)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
            Compartir
          </button>
          <button onClick={handleDeleteList} className="bg-red-500 text-white px-2 py-1 rounded">
            Eliminar Lista
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {showTaskForm ? 'Ocultar formulario' : 'Añadir tarea'}
        </button>
      </div>
      {showTaskForm && (
        <TaskForm listId={list.id} onCreated={() => { setShowTaskForm(false); onRefresh() }} />
      )}

      {list.tasks.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">No hay tareas en esta lista.</p>
      ) : (
        <ul className="mt-2">
          {list.tasks.map(task => (
            <li key={task.id} className="border-b border-gray-200 py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {task.starred && <span className="mr-1 text-yellow-600">★</span>}
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
              <div className="flex items-center">
                {/* Botones para completar, editar y eliminar tarea */}
                <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showShareModal && <ShareTaskListModal listId={list.id} onClose={() => setShowShareModal(false)} />}
    </div>
  )
}

export default TaskListItem
