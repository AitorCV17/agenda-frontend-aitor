import React, { useState, useEffect } from 'react';
import axios from '../services/api';

export interface TaskData {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
  starred?: boolean;
}

export interface TaskFormProps {
  listId: number;
  initialData?: TaskData;
  onTaskCreated: () => void;
  onTaskUpdated: () => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  listId,
  initialData,
  onTaskCreated,
  onTaskUpdated,
  onClose,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [completed, setCompleted] = useState(initialData?.completed || false);
  const [starred, setStarred] = useState(initialData?.starred || false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCompleted(initialData.completed || false);
      setStarred(initialData.starred || false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, description, completed, starred };
      if (initialData && initialData.id) {
        await axios.put(`/tasks/lists/${listId}/tasks/${initialData.id}`, payload);
        onTaskUpdated();
      } else {
        await axios.post(`/tasks/lists/${listId}/tasks`, payload);
        onTaskCreated();
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar la tarea');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm transition-all duration-300"
    >
      {error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
        />
      </div>
      <div className="flex items-center">
        <input
          id="starred"
          type="checkbox"
          checked={starred}
          onChange={(e) => setStarred(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="starred" className="text-sm text-gray-700 dark:text-gray-300">
          Destacar Tarea
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md text-sm transition-all duration-300 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800"
      >
        {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;
