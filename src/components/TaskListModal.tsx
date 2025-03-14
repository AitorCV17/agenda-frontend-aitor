import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const TaskListModal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 w-full max-w-md mx-4 rounded-lg shadow-lg relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskListModal;
