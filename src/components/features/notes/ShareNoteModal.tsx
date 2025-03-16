import React, { useState, useEffect, useRef } from 'react'
import axios from '../../../services/api';

interface SharedUser {
  id: number
  email: string
  permission: 'READ' | 'EDIT'
  compartidoPor: string
}

interface ShareNoteModalProps {
  noteId: number
  onClose: () => void
}

const ShareNoteModal: React.FC<ShareNoteModalProps> = ({ noteId, onClose }) => {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'READ' | 'EDIT'>('READ')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([])
  const [loadingShares, setLoadingShares] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSharedUsers()
  }, [noteId])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const fetchSharedUsers = async () => {
    try {
      setLoadingShares(true)
      const res = await axios.get(`/notes/${noteId}/shares`)
      setSharedUsers(res.data)
    } catch (err: any) {
      setError('Error al obtener usuarios compartidos')
    } finally {
      setLoadingShares(false)
    }
  }

  const handleShare = async () => {
    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')
      await axios.post(`/notes/${noteId}/share`, {
        shareItems: [{ email, permission }],
      })
      setEmail('')
      setPermission('READ')
      setSuccessMessage('Nota compartida con éxito')
      fetchSharedUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al compartir la nota')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRevoke = async (userId: number) => {
    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')
      await axios.delete(`/notes/${noteId}/share/${userId}`)
      setSuccessMessage('Acceso revocado')
      fetchSharedUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al revocar acceso')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 px-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 relative"
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 text-2xl hover:text-red-500"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-4">
          Compartir Nota
        </h2>
        {error && (
          <div className="text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-400 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Permiso
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'READ' | 'EDIT')}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:ring-azure-500 focus:ring-2"
            >
              <option value="READ">Lectura</option>
              <option value="EDIT">Edición</option>
            </select>
          </div>
          <button
            onClick={handleShare}
            disabled={actionLoading}
            className="w-full bg-azure-700 hover:bg-azure-600 text-white font-semibold py-2 rounded shadow-md text-sm transition disabled:opacity-50"
          >
            {actionLoading ? 'Compartiendo...' : 'Compartir'}
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Usuarios con acceso
          </h3>
          {loadingShares ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
          ) : sharedUsers.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sin usuarios compartidos
            </p>
          ) : (
            <ul className="space-y-2">
              {sharedUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between bg-azure-50 dark:bg-azure-900 rounded px-3 py-2 text-sm shadow"
                >
                  <div>
                    <p className="font-medium text-azure-700 dark:text-azure-300">
                      {u.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Permiso: {u.permission === 'READ' ? 'Lectura' : 'Edición'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(u.id)}
                    disabled={actionLoading}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded shadow transition disabled:opacity-50"
                  >
                    Revocar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareNoteModal
