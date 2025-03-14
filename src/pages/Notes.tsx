import React, { useEffect, useState } from 'react'
import axios from '../services/api'
import NoteForm from '../components/NoteForm'
import NoteList from '../components/NoteList'

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([])

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notas</h2>
      <NoteForm onNoteCreated={fetchNotes} />
      <NoteList notes={notes} onRefresh={fetchNotes} />
    </div>
  )
}

export default Notes
