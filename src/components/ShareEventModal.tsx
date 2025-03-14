import React, { useState } from 'react'
import axios from '../services/api'

interface ShareEventModalProps {
  eventId: number
  onClose: () => void
}

const ShareEventModal: React.FC<ShareEventModalProps> = ({ eventId, onClose }) => {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'READ' | 'EDIT'>('READ')
  const [error, setError] = useState('')

  const handleShare = async () => {
    try {
      await axios.post(`/events/${eventId}/share`, {
        shareItems: [{ email, permission }]
      })
      onClose()
      alert('Evento compartido con éxito')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al compartir el evento')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Compartir Evento</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Permiso:</label>
          <select
            value={permission}
            onChange={e => setPermission(e.target.value as 'READ' | 'EDIT')}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="READ">Lectura</option>
            <option value="EDIT">Edición</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-500 text-white px-3 py-1 rounded">
            Cancelar
          </button>
          <button onClick={handleShare} className="bg-blue-600 text-white px-3 py-1 rounded">
            Compartir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareEventModal
