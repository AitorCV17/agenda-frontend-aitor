import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm, { TaskData } from './TaskForm';

interface TaskModalProps {
  isOpen: boolean;
  listId: number;
  initialData?: TaskData;
  onClose: () => void;
  onTaskSaved: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  listId,
  initialData,
  onClose,
  onTaskSaved
}) => {
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
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-2"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Cerrar Modal"
          >
            &times;
          </button>
          <div className="px-6 pt-6">
            <h2 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-4">
              {initialData ? 'Editar Tarea' : 'Crear Tarea'}
            </h2>
          </div>
          <div className="px-6 pb-6">
            <TaskForm
              listId={listId}
              initialData={initialData}
              onTaskCreated={() => {
                onTaskSaved();
                onClose();
              }}
              onTaskUpdated={() => {
                onTaskSaved();
                onClose();
              }}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;
