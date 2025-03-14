// src/pages/Notes.tsx
import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import NoteList from '../components/NoteList'
import NoteModal from '../components/NoteModal'
import { NoteData } from '../components/NoteForm'

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalInitialData, setModalInitialData] = useState<NoteData | undefined>(undefined)

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes')
      setNotes(res.data)
    } catch (err) {
      console.error('Error al obtener notas')
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleCreate = () => {
    setModalInitialData(undefined)
    setShowModal(true)
  }

  const handleEdit = (note: any) => {
    setModalInitialData(note)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notas</h2>
      <button
        onClick={handleCreate}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Nota
      </button>
      <NoteList notes={notes} onRefresh={fetchNotes} onEdit={handleEdit} />
      <NoteModal
        isOpen={showModal}
        initialData={modalInitialData}
        onClose={handleModalClose}
        onNoteSaved={fetchNotes}
      />
    </div>
  )
}

export default Notes
