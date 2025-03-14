import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/agenda');
      setEvents(res.data);
    } catch (err) {
      console.error('Error al obtener eventos');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refresh]);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Eventos</h2>
      <EventForm onEventCreated={handleRefresh} />
      <EventList events={events} onRefresh={handleRefresh} />
    </div>
  );
};

export default Events;
