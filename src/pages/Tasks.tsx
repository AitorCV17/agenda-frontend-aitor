import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import TaskListForm from '../components/features/tasks/tasklist/TaskListForm';
import TaskListItem from '../components/features/tasks/tasklist/TaskListItem';
import Modal from '../components/features/tasks/tasklist/TaskListModal';
import { motion } from 'framer-motion';

const Tasks: React.FC = () => {
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [showTaskListModal, setShowTaskListModal] = useState(false);

  const fetchTaskLists = async () => {
    try {
      const res = await axios.get('/tasks/lists');
      setTaskLists(res.data);
    } catch (err) {
      console.error('Error al obtener listas de tareas', err);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  const sortedTaskLists = [...taskLists].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  return (
    <motion.div
      className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-azure-700 dark:text-azure-300"
          >
            Tareas
          </motion.h2>

          <motion.button
            onClick={() => setShowTaskListModal(true)}
            className="bg-azure-700 hover:bg-azure-600 focus:ring-4 focus:ring-azure-300 dark:focus:ring-azure-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            whileTap={{ scale: 0.95 }}
          >
            + Crear Lista de Tareas
          </motion.button>
        </div>

        {showTaskListModal && (
          <Modal onClose={() => setShowTaskListModal(false)}>
            <TaskListForm
              onCreated={() => {
                fetchTaskLists();
                setShowTaskListModal(false);
              }}
            />
          </Modal>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {sortedTaskLists.map((list) => (
            <TaskListItem
              key={list.id}
              list={list}
              onRefresh={fetchTaskLists}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Tasks;
