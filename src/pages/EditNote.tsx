import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import NoteForm, { NoteData } from '../components/features/notes/NoteForm';

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/notes/${id}`);
        setNoteData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar la nota');
      }
    };
    fetchNote();
  }, [id]);

  const handleUpdate = () => {
    navigate('/notes');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Nota</h2>
      {error && <p className="text-red-500">{error}</p>}
      {noteData ? (
        <NoteForm initialData={noteData} onNoteUpdated={handleUpdate} />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default EditNote;
