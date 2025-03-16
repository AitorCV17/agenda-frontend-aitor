import React, { useEffect, useRef } from 'react';
import NoteForm, { NoteData } from './NoteForm';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteModalProps {
  isOpen: boolean;
  initialData?: NoteData;
  onClose: () => void;
  onNoteSaved: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, initialData, onClose, onNoteSaved }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div key="overlay" className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-2" onClick={handleOverlayClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div key="modal" ref={modalRef} className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500 focus:outline-none" aria-label="Cerrar Modal">
            &times;
          </button>
          <div className="px-6 pt-6">
            <h2 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-4">{initialData ? 'Editar Nota' : 'Crear Nota'}</h2>
          </div>
          <div className="px-6 pb-6">
            <NoteForm initialData={initialData} onNoteCreated={() => { onNoteSaved(); onClose(); }} onNoteUpdated={() => { onNoteSaved(); onClose(); }} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NoteModal;
