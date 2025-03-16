import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import EventForm, { EventData } from '../components/features/events/EventForm';

function toDateTimeLocal(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date.toISOString().slice(0, 16);
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${id}`);
        const event = res.data;
        event.startTime = toDateTimeLocal(event.startTime);
        event.endTime = toDateTimeLocal(event.endTime);
        setEventData(event);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el evento');
      }
    };
    fetchEvent();
  }, [id]);

  const handleUpdate = () => {
    navigate('/events');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Evento</h2>
      {error && <p className="text-red-500">{error}</p>}
      {eventData ? (
        <EventForm initialData={eventData} onEventUpdated={handleUpdate} />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default EditEvent;
