import React, { useState, useContext } from 'react'
import axios from '../services/api'
import ShareNoteModal from './ShareNoteModal'
import { motion } from 'framer-motion'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AuthContext } from '../context/AuthContext'
import NoteDetailModal from './NoteDetailModal' // Nuevo modal de detalle

interface Note {
  id: number
  title: string
  content?: string
  color?: string
  createdAt: string
  userId: number
  user?: { email: string }
  shares?: Array<{ 
    permission: string, 
    sharedBy: { email: string, id: number } 
  }>
}

interface NoteListProps {
  notes: Note[]
  onRefresh: () => void
  onEdit: (note: Note) => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onRefresh, onEdit }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [shareNoteId, setShareNoteId] = useState<number | null>(null)
  const [detailNote, setDetailNote] = useState<Note | null>(null) // Estado para modal de detalle
  const { user } = useContext(AuthContext)
  const currentUserId = user?.id

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar la nota')
    }
  }

  const toggleMenu = (id: number) => {
    setMenuOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
        Listado de Notas
      </h3>
      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay notas.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map(note => {
            const noteColor = note.color || '#5179a6'
            const isOwned = note.userId === currentUserId
            const sharedPermission = !isOwned && note.shares && note.shares.length > 0 ? note.shares[0].permission : null
            const canEdit = isOwned || sharedPermission === 'EDIT'
            return (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: `${noteColor}20`,
                  borderColor: `${noteColor}66`
                }}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm cursor-pointer"
                onClick={() => setDetailNote(note)} // Al hacer click abre modal de detalle
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                  {note.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                    </p>
                  )}
                  {!isOwned && note.shares && note.shares.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Compartido por: {note.shares[0].sharedBy.email}
                    </p>
                  )}
                </div>
                {/* Mostrar el botón de menú solo si el usuario tiene permisos de edición */}
                {canEdit && (
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(note.id)} className="p-2">
                      <BsThreeDotsVertical className="text-2xl text-gray-600 dark:text-gray-300" />
                    </button>
                    {menuOpenId === note.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                        <button
                          onClick={() => { onEdit(note); setMenuOpenId(null) }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Editar
                        </button>
                        {isOwned && (
                          <>
                            <button
                              onClick={() => { setShareNoteId(note.id); setMenuOpenId(null) }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Compartir
                            </button>
                            <button
                              onClick={() => { handleDelete(note.id); setMenuOpenId(null) }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            )
          })}
        </ul>
      )}
      {shareNoteId && (
        <ShareNoteModal
          noteId={shareNoteId}
          onClose={() => setShareNoteId(null)}
        />
      )}
      {detailNote && (
        <NoteDetailModal
          note={detailNote}
          onClose={() => setDetailNote(null)}
        />
      )}
    </div>
  )
}

export default NoteList
