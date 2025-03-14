// src/components/NoteModal.tsx
import React from 'react'
import NoteForm, { NoteData } from './NoteForm'

interface NoteModalProps {
  isOpen: boolean
  initialData?: NoteData
  onClose: () => void
  onNoteSaved: () => void
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, initialData, onClose, onNoteSaved }) => {
  if (!isOpen) return null

  const handleNoteCreated = () => {
    onNoteSaved()
    onClose()
  }

  const handleNoteUpdated = () => {
    onNoteSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-lg">
        <button onClick={onClose} className="float-right text-gray-600 text-2xl leading-none">
          &times;
        </button>
        <NoteForm
          initialData={initialData}
          onNoteCreated={handleNoteCreated}
          onNoteUpdated={handleNoteUpdated}
        />
      </div>
    </div>
  )
}

export default NoteModal
