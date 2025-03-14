import React, { useState } from 'react';
import axios from '../services/api';

interface EventFormProps {
  onEventCreated: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#000000');
  const [reminderOffset, setReminderOffset] = useState<number | undefined>(undefined);
  const [recurrence, setRecurrence] = useState('NONE');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/agenda', {
        title,
        description,
        startTime,
        endTime,
        color,
        reminderOffset,
        recurrence
      });
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setColor('#000000');
      setReminderOffset(undefined);
      setRecurrence('NONE');
      onEventCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el evento');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Crear Evento</h3>
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
        <label className="block mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Inicio (fecha y hora)</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Fin (fecha y hora)</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
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
      <div className="mb-4">
        <label className="block mb-1">Recordatorio (minutos antes)</label>
        <input
          type="number"
          value={reminderOffset || ''}
          onChange={(e) => setReminderOffset(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Ejemplo: 10"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Recurrencia</label>
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="NONE">Sin recurrencia</option>
          <option value="DAILY">Diario</option>
          <option value="WEEKLY">Semanal</option>
          <option value="MONTHLY">Mensual</option>
          <option value="YEARLY">Anual</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Crear Evento
      </button>
    </form>
  );
};

export default EventForm;
