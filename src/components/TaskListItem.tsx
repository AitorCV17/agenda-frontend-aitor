import React from 'react';
import axios from '../services/api';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  starred: boolean;
}

interface TaskList {
  id: number;
  name: string;
  pinned: boolean;
  tasks: Task[];
}

interface TaskListItemProps {
  list: TaskList;
  onRefresh: () => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ list, onRefresh }) => {
  // Eliminar lista completa
  const handleDeleteList = async () => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return;
    try {
      await axios.delete(`/tasks/lists/${list.id}`);
      onRefresh();
    } catch {
      console.error('Error al eliminar la lista');
    }
  };

  // Compartir la lista con otros usuarios (por email)
  const handleShareList = async () => {
    const userEmails = prompt('Ingrese correos separados por coma:');
    if (!userEmails) return;
    const emailsArray = userEmails.split(',').map(email => email.trim());
    try {
      await axios.post(`/tasks/lists/${list.id}/share`, {
        shareItems: emailsArray.map(email => ({
          email,
          permission: 'EDIT' // o 'READ'
        }))
      });
      alert('Lista compartida con éxito');
    } catch {
      console.error('Error al compartir la lista');
    }
  };

  // Eliminar tarea específica
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await axios.delete(`/tasks/lists/${list.id}/tasks/${taskId}`);
      onRefresh();
    } catch {
      console.error('Error al eliminar la tarea');
    }
  };

  // Cambiar completado
  const handleToggleComplete = async (taskId: number) => {
    try {
      await axios.patch(`/tasks/lists/${list.id}/tasks/${taskId}/toggle`);
      onRefresh();
    } catch {
      console.error('Error al marcar la tarea como completada');
    }
  };

  // Cambiar destacado (estrella)
  const handleToggleStar = async (taskId: number) => {
    try {
      await axios.patch(`/tasks/lists/${list.id}/tasks/${taskId}/star`);
      onRefresh();
    } catch {
      console.error('Error al destacar la tarea');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">
          {list.pinned && <span className="mr-2 text-yellow-500">📌</span>}
          {list.name}
        </h3>
        <div>
          <button
            onClick={handleShareList}
            className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
          >
            Compartir
          </button>
          <button
            onClick={handleDeleteList}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Eliminar Lista
          </button>
        </div>
      </div>

      {list.tasks.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">No hay tareas en esta lista.</p>
      ) : (
        <ul className="mt-2">
          {list.tasks.map((task) => (
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
  );
};

export default TaskListItem;
