import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import EventList from '../components/EventList';
import EventModal from '../components/EventModal';
import { EventData } from '../components/EventForm';
import { motion } from 'framer-motion';

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<EventData | undefined>(undefined);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error al obtener eventos');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setModalInitialData(undefined);
    setShowModal(true);
  };

  const handleEdit = (event: any) => {
    setModalInitialData(event);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-azure-700 dark:text-azure-300"
          >
            Eventos
          </motion.h2>

          <motion.button
            onClick={handleCreate}
            className="bg-azure-700 hover:bg-azure-600 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            whileTap={{ scale: 0.95 }}
          >
            + Crear Evento
          </motion.button>
        </div>

        <EventList
          events={events}
          onRefresh={fetchEvents}
          onEdit={handleEdit}
        />

        <EventModal
          isOpen={showModal}
          initialData={modalInitialData}
          onClose={handleModalClose}
          onEventSaved={fetchEvents}
        />
      </div>
    </motion.div>
  );
};

export default Events;
