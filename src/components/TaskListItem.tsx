import React, { useState, useContext } from 'react'
import axios from '../services/api'
import TaskModal from './TaskModal'
import ShareTaskListModal from './ShareTaskListModal'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AuthContext } from '../context/AuthContext'
import TaskDetailModal from './TaskDetailModal'  // <--- Importa el modal de detalle

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
  userId: number
  user?: { email: string }
  shares?: Array<{ 
    permission: string, 
    sharedBy: { email: string, id: number } 
  }>
}

interface TaskListItemProps {
  list: TaskList
  onRefresh: () => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ list, onRefresh }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [editingList, setEditingList] = useState(false)
  const [listName, setListName] = useState(list.name)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  // Nuevo estado para controlar el menú de cada tarea
  const [taskMenuOpenId, setTaskMenuOpenId] = useState<number | null>(null)

  const { user } = useContext(AuthContext)
  const currentUserId = user?.id
  const isOwned = list.userId === currentUserId
  const sharedPermission = !isOwned && list.shares && list.shares.length > 0 ? list.shares[0].permission : null
  const canEdit = isOwned || (sharedPermission === 'EDIT')

  const handleDeleteList = async () => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return
    try {
      await axios.delete(`/tasks/lists/${list.id}`)
      onRefresh()
    } catch {
      console.error('Error al eliminar la lista')
    }
  }

  const handleUpdateList = async () => {
    try {
      await axios.put(`/tasks/lists/${list.id}`, { name: listName, pinned: list.pinned })
      setEditingList(false)
      onRefresh()
    } catch {
      console.error('Error al actualizar la lista')
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

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setShowTaskModal(true)
  }

  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setCurrentTask(null)
  }

  const handleCreateTask = () => {
    setCurrentTask(null)
    setShowTaskModal(true)
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        {editingList ? (
          <div className="flex items-center">
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="border border-gray-300 p-1 rounded mr-2"
            />
            <button onClick={handleUpdateList} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Guardar
            </button>
            <button onClick={() => { setEditingList(false); setListName(list.name) }} className="bg-gray-500 text-white px-2 py-1 rounded">
              Cancelar
            </button>
          </div>
        ) : (
          <h3 className="text-lg font-bold">
            {list.pinned && <span className="mr-1 text-yellow-600">📌</span>}
            {list.name}
          </h3>
        )}
        {canEdit && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              <BsThreeDotsVertical className="text-2xl text-gray-600" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                {canEdit && (
                  <button
                    onClick={() => { setEditingList(true); setMenuOpen(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Editar Lista
                  </button>
                )}
                {isOwned && (
                  <button
                    onClick={() => { setShowShareModal(true); setMenuOpen(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Compartir
                  </button>
                )}
                {isOwned && (
                  <button
                    onClick={() => { handleDeleteList(); setMenuOpen(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Eliminar Lista
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleCreateTask}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Añadir Tarea
        </button>
      </div>
      {list.tasks.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">No hay tareas en esta lista.</p>
      ) : (
        <ul className="mt-2">
          {list.tasks.map(task => (
            <li
              key={task.id}
              className="border-b border-gray-200 py-2 flex justify-between items-center cursor-pointer"
              onClick={() => setDetailTask(task)}
            >
              <div>
                <p className="font-medium">
                  {task.starred && <span className="mr-1 text-yellow-600">★</span>}
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
              {/* Menú de tres puntitos para cada tarea */}
              {canEdit && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setTaskMenuOpenId(prev => (prev === task.id ? null : task.id))} className="p-2">
                    <BsThreeDotsVertical className="text-2xl text-gray-600" />
                  </button>
                  {taskMenuOpenId === task.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                      <button
                        onClick={() => { handleEditTask(task); setTaskMenuOpenId(null) }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => { handleDeleteTask(task.id); setTaskMenuOpenId(null) }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal para compartir la lista */}
      {showShareModal && (
        <ShareTaskListModal
          listId={list.id}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Modal para crear/editar tarea */}
      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          listId={list.id}
          initialData={currentTask || undefined}
          onClose={handleCloseTaskModal}
          onTaskSaved={onRefresh}
        />
      )}

      {/* Modal de detalle de la tarea */}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
        />
      )}
    </div>
  )
}

export default TaskListItem
