import React, { useState, useEffect } from 'react';
import axios from '../services/api';

export interface NoteData {
  id?: number;
  title: string;
  content?: string;
  color?: string;
}

interface NoteFormProps {
  initialData?: NoteData;
  onNoteCreated?: () => void;
  onNoteUpdated?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ initialData, onNoteCreated, onNoteUpdated }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [color, setColor] = useState(initialData?.color || '#5179a6');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || '');
      setColor(initialData.color || '#5179a6');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, content, color };
      if (initialData && initialData.id) {
        await axios.put(`/notes/${initialData.id}`, payload);
        onNoteUpdated && onNoteUpdated();
      } else {
        await axios.post('/notes', payload);
        onNoteCreated && onNoteCreated();
        setTitle('');
        setContent('');
        setColor('#5179a6');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar la nota');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm transition-all duration-300">
      {error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Escribe tu nota aquí..."
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2 outline-none transition resize-none"
        />
      </div>
      <div className="flex items-center space-x-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md text-sm transition-all duration-300 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800"
      >
        {initialData ? 'Actualizar Nota' : 'Crear Nota'}
      </button>
    </form>
  );
};

export default NoteForm;
