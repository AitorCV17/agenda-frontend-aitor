import React from 'react'
import TaskForm, { TaskData } from './TaskForm'

interface TaskModalProps {
  isOpen: boolean
  listId: number
  initialData?: TaskData
  onClose: () => void
  onTaskSaved: () => void
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, listId, initialData, onClose, onTaskSaved }) => {
  if (!isOpen) return null

  const handleTaskCreated = () => {
    onTaskSaved()
    onClose()
  }

  const handleTaskUpdated = () => {
    onTaskSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-lg">
        <button onClick={onClose} className="float-right text-gray-600 text-2xl leading-none">&times;</button>
        <TaskForm listId={listId} initialData={initialData} onTaskCreated={handleTaskCreated} onTaskUpdated={handleTaskUpdated} />
      </div>
    </div>
  )
}

export default TaskModal;
