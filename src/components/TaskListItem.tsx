import React from 'react'
import axios from '../services/api'

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
  const handleDeleteList = async () => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return
    try {
      await axios.delete(`/tasks/lists/${list.id}`)
      onRefresh()
    } catch {
      console.error('Error al eliminar la lista')
    }
  }

  const handleShareList = async () => {
    const userEmails = prompt('Ingrese correos separados por coma:')
    if (!userEmails) return
    const emailsArray = userEmails.split(',').map(email => email.trim())
    try {
      await axios.post(`/tasks/lists/${list.id}/share`, {
        shareItems: emailsArray.map(email => ({ email, permission: 'EDIT' }))
      })
      alert('Lista compartida con éxito')
    } catch {
      console.error('Error al compartir la lista')
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await axios.delete(`/tasks/lists/${list.id}/tasks/${taskId}`)
      onRefresh()
    } catch {
      console.error('Error al eliminar la tarea')
    }
  }

  const handleToggleComplete = async (taskId: number) => {
    try {
      await axios.put(`/tasks/lists/${list.id}/tasks/${taskId}`, { completed: true })
      onRefresh()
    } catch {
      console.error('Error al alternar estado de completado')
    }
  }

  const handleToggleStar = async (taskId: number) => {
    try {
      await axios.put(`/tasks/lists/${list.id}/tasks/${taskId}`, { starred: true })
      onRefresh()
    } catch {
      console.error('Error al alternar estado de starred')
    }
  }

  const handleEditTask = async (task: Task) => {
    const newTitle = prompt('Editar título:', task.title)
    if (newTitle === null) return
    const newDescription = prompt('Editar descripción:', task.description || '')
    try {
      await axios.put(`/tasks/lists/${list.id}/tasks/${task.id}`, {
        title: newTitle,
        description: newDescription,
        completed: task.completed,
        starred: task.starred
      })
      onRefresh()
    } catch {
      console.error('Error al editar la tarea')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">
          {list.pinned && <span className="mr-2 text-yellow-500">📌</span>}
          {list.name}
        </h3>
        <div>
          <button onClick={handleShareList} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">
            Compartir
          </button>
          <button onClick={handleDeleteList} className="bg-red-500 text-white px-2 py-1 rounded">
            Eliminar Lista
          </button>
        </div>
      </div>
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
                <label className="mr-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />{' '}
                  Completada
                </label>
                <button
                  onClick={() => handleToggleStar(task.id)}
                  className="mr-2 bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Star
                </button>
                <button onClick={() => handleEditTask(task)} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskListItem
