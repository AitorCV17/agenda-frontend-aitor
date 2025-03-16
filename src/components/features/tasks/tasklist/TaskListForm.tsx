import React, { useState } from 'react';
import axios from '../../../../services/api';

interface TaskListFormProps {
  onCreated?: () => void;
}

const TaskListForm: React.FC<TaskListFormProps> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/tasks/lists', { name });
      if (onCreated) onCreated();
      setName('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la lista de tareas');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm transition-all duration-300"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nueva Lista de Tareas</h2>

      {error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de la lista
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition"
          placeholder="Ej. Compras"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md text-sm transition-all duration-300 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800"
      >
        Guardar Lista
      </button>
    </form>
  );
};

export default TaskListForm;
