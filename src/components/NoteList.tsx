import React, { useState, useContext, useEffect } from 'react'
import axios from '../services/api'
import ShareNoteModal from './ShareNoteModal'
import NoteDetailModal from './NoteDetailModal'
import { motion } from 'framer-motion'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiPin, BiSolidPin } from 'react-icons/bi'
import { AuthContext } from '../context/AuthContext'

interface Note {
  id: number
  title: string
  content?: string
  color?: string   // Hex color, p.ej. "#ff0000"
  createdAt: string
  userId: number
  pinned?: boolean
  user?: { email: string }
  shares?: Array<{ 
    permission: string
    sharedBy: { email: string, id: number }
  }>
}

interface NoteListProps {
  notes: Note[]
  onRefresh: () => void
  onEdit: (note: Note) => void
}

// Función para suavizar el color (agregar ~20% de transparencia si es un hex tipo #rrggbb)
function getSoftColor(hexColor?: string): string {
  if (!hexColor) return '#ffffff';
  // Si no empieza con "#" o no tiene 7 caracteres (# + 6 hex), devolvemos tal cual.
  // (Podrías implementar validaciones más completas si lo deseas.)
  if (hexColor.startsWith('#') && hexColor.length === 7) {
    // Ej: "#ff0000" -> "#ff000033"
    return hexColor + '33'; 
  }
  // Si no es un caso estándar, devuélvelo sin cambios o un fallback
  return hexColor;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onRefresh, onEdit }) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [shareNoteId, setShareNoteId] = useState<number | null>(null)
  const [detailNote, setDetailNote] = useState<Note | null>(null)
  const { user } = useContext(AuthContext)
  const currentUserId = user?.id

  // Sincroniza localNotes cuando cambien las props "notes"
  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  // Eliminar nota
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar la nota', err)
    }
  }

  // Abrir/cerrar menú de opciones
  const toggleMenu = (id: number) => {
    setMenuOpenId(prev => (prev === id ? null : id))
  }

  // Fijar/Desfijar la nota
  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()

    // Cambia localmente para ver el efecto inmediato
    setLocalNotes(prevNotes =>
      prevNotes.map(n =>
        n.id === note.id ? { ...n, pinned: !note.pinned } : n
      )
    )

    // Llama al backend para actualizar
    try {
      await axios.put(`/notes/${note.id}`, { pinned: !note.pinned })
      onRefresh()
    } catch (err) {
      console.error('Error al actualizar pinned', err)
    }
  }

  // Ordena las notas: primero las fijadas
  const sortedNotes = [...localNotes].sort((a, b) => {
    if (b.pinned && !a.pinned) return 1
    if (a.pinned && !b.pinned) return -1
    return 0
  })

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
        Listado de Notas
      </h3>

      {sortedNotes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay notas.</p>
      ) : (
        // Grid para que se vean en columnas
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map(note => {
            const isOwned = note.userId === currentUserId
            const sharedPermission =
              !isOwned && note.shares && note.shares.length > 0
                ? note.shares[0].permission
                : null
            const canEdit = isOwned || sharedPermission === 'EDIT'

            // Borde más grueso si está fijada
            const pinnedStyles = note.pinned
              ? 'border-l-8 border-yellow-300'
              : 'border-l-4 border-gray-200'

            return (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                // Clases "rectangulares"
                className={`group relative flex flex-col p-4 min-h-[150px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] rounded-md ${pinnedStyles}`}
                style={{
                  // Agregamos el color con transparencia
                  backgroundColor: getSoftColor(note.color),
                  backdropFilter: 'blur(2px)',
                }}
              >
                {/* Pin arriba a la derecha (aparece al hover) */}
                <div
                  className="absolute top-2 right-2 hidden group-hover:block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleTogglePin(note, e)}
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

                {/* Contenido de la nota (abre modal de detalle) */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setDetailNote(note)}
                >
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {note.title}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                  {note.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {note.content.length > 100
                        ? `${note.content.slice(0, 100)}...`
                        : note.content}
                    </p>
                  )}
                  {/* Compartido por... */}
                  {!isOwned && note.shares && note.shares.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Compartido por: {note.shares[0].sharedBy.email}
                    </p>
                  )}
                </div>

                {/* Menú de acciones (tres puntos) si el usuario puede editar */}
                {canEdit && (
                  <div
                    className="absolute bottom-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                            onEdit(note)
                            setMenuOpenId(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Editar
                        </button>
                        {isOwned && (
                          <>
                            <button
                              onClick={() => {
                                setShareNoteId(note.id)
                                setMenuOpenId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Compartir
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(note.id)
                                setMenuOpenId(null)
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
            )
          })}
        </ul>
      )}

      {/* Modal para compartir */}
      {shareNoteId && (
        <ShareNoteModal
          noteId={shareNoteId}
          onClose={() => setShareNoteId(null)}
        />
      )}
      {/* Modal de detalle */}
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
