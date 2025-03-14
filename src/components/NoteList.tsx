import React, { useState, useContext, useEffect } from 'react';
import axios from '../services/api';
import ShareNoteModal from './ShareNoteModal';
import NoteDetailModal from './NoteDetailModal';
import { motion } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiPin, BiSolidPin } from 'react-icons/bi';
import { AuthContext } from '../context/AuthContext';

interface Note {
  id: number;
  title: string;
  content?: string;
  color?: string;
  createdAt: string;
  userId: number;
  pinned?: boolean;
  user?: { email: string };
  shares?: Array<{ 
    permission: string;
    sharedBy: { email: string; id: number };
  }>;
}

interface NoteListProps {
  notes: Note[];
  onRefresh: () => void;
  onEdit: (note: Note) => void;
}

function getSoftColor(hexColor?: string): string {
  if (!hexColor) return '#ffffff';
  if (hexColor.startsWith('#') && hexColor.length === 7) return hexColor + '33';
  return hexColor;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onRefresh, onEdit }) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [shareNoteId, setShareNoteId] = useState<number | null>(null);
  const [detailNote, setDetailNote] = useState<Note | null>(null);
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id;

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`);
      onRefresh();
    } catch (err) {
      console.error('Error al eliminar la nota', err);
    }
  };

  const toggleMenu = (id: number) => {
    setMenuOpenId(prev => (prev === id ? null : id));
  };

  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = !note.pinned;
    
    // Optimiza la UI para reflejar el cambio antes de la respuesta del backend
    setLocalNotes(prevNotes =>
      prevNotes.map(n => (n.id === note.id ? { ...n, pinned: newPinned } : n))
    );

    try {
      await axios.put(`/notes/${note.id}`, { pinned: newPinned });
      onRefresh();
    } catch (err) {
      console.error('Error al actualizar pinned', err);
      // Revertir el cambio en caso de error
      setLocalNotes(prevNotes =>
        prevNotes.map(n => (n.id === note.id ? { ...n, pinned: !newPinned } : n))
      );
    }
  };

  // Ordena las notas para que las fijadas aparezcan primero
  const sortedNotes = [...localNotes].sort((a, b) => (b.pinned ? 1 : -1));

  return (
    <>
      {sortedNotes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay notas.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map(note => {
            const isOwned = note.userId === currentUserId;
            const sharedPermission =
              !isOwned && note.shares && note.shares.length > 0
                ? note.shares[0].permission
                : null;
            const canEdit = isOwned || sharedPermission === 'EDIT';
            const pinnedStyles = note.pinned
              ? 'border-l-8 border-yellow-300'
              : 'border-l-4 border-gray-200';

            return (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`group relative flex flex-col p-4 min-h-[150px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] rounded-md ${pinnedStyles}`}
                style={{
                  backgroundColor: getSoftColor(note.color),
                  backdropFilter: 'blur(2px)'
                }}
                onClick={() => setDetailNote(note)}
              >
                {/* Botón Pin */}
                <div
                  className="absolute top-2 right-2 hidden group-hover:block"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={e => handleTogglePin(note, e)}
                    title={note.pinned ? 'Desfijar nota' : 'Fijar nota'}
                    className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {note.pinned ? (
                      <BiSolidPin className="text-xl text-yellow-600" />
                    ) : (
                      <BiPin className="text-xl text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Contenido de la Nota */}
                <div className="flex-1 cursor-pointer" onClick={() => setDetailNote(note)}>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{note.title}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{new Date(note.createdAt).toLocaleString()}</p>
                  {note.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                    </p>
                  )}
                  {!isOwned && note.shares && note.shares.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Compartido por: {note.shares[0].sharedBy.email}
                    </p>
                  )}
                </div>

                {/* Menú de opciones */}
                {canEdit && (
                  <div className="absolute bottom-2 right-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleMenu(note.id)}
                      className="p-2 text-gray-600 dark:text-gray-300"
                    >
                      <BsThreeDotsVertical className="text-2xl" />
                    </button>
                    {menuOpenId === note.id && (
                      <div className="absolute right-0 bottom-8 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                        <button
                          onClick={() => {
                            onEdit(note);
                            setMenuOpenId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Editar
                        </button>
                        {isOwned && (
                          <>
                            <button
                              onClick={() => {
                                setShareNoteId(note.id);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Compartir
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(note.id);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
      {shareNoteId && <ShareNoteModal noteId={shareNoteId} onClose={() => setShareNoteId(null)} />}
      {detailNote && <NoteDetailModal note={detailNote} onClose={() => setDetailNote(null)} />}
    </>
  );
};

export default NoteList;