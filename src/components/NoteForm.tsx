import React, { useState } from 'react';
import axios from '../services/api';

interface NoteFormProps {
  onNoteCreated: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/notes', { title, content, color });
      setTitle('');
      setContent('');
      setColor('#000000');
      onNoteCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la nota');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Crear Nota</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Contenido</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="block mr-2">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 border-2"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Crear Nota
      </button>
    </form>
  );
};

export default NoteForm;
