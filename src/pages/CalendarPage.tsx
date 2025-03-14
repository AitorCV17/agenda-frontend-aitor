import React, { useState } from 'react';
import axios from '../services/api';
import Calendar from '../components/Calendar';
import { motion } from 'framer-motion';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchCalendarEvents = async (range: { start: string; end: string }) => {
    try {
      const res = await axios.get(`/events/calendar?start=${range.start}&end=${range.end}`);
      setEvents(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener eventos del calendario');
    }
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-azure-700 dark:text-azure-300"
        >
          Calendario de Eventos
        </motion.h1>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded mb-6">
          {error}
        </div>
      )}

      <Calendar events={events} onDateChange={fetchCalendarEvents} />
    </motion.div>
  );
};

export default CalendarPage;
