import React, { useState, useContext } from 'react';
import axios from '../../../../services/api';
import TaskModal from '../TaskModal';
import ShareTaskListModal from './ShareTaskListModal';
import TaskDetailModal from '../TaskDetailModal';
import { motion } from 'framer-motion';
import { BsThreeDotsVertical, BsCheckCircle, BsCircle } from 'react-icons/bs';
import { BiPin, BiSolidPin } from 'react-icons/bi';
import { AuthContext } from '../../../../context/AuthContext';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  starred: boolean;
}

interface TaskList {
  id: number;
  name: string;
  pinned: boolean;
  tasks: Task[];
  userId: number;
  user?: { email: string };
  shares?: Array<{
    permission: string;
    sharedBy: { email: string; id: number };
  }>;
}

interface TaskListItemProps {
  list: TaskList;
  onRefresh: () => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ list, onRefresh }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingList, setEditingList] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [pinned, setPinned] = useState(list.pinned);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [taskMenuOpenId, setTaskMenuOpenId] = useState<number | null>(null);

  const { user } = useContext(AuthContext);
  const currentUserId = user?.id;
  const isOwned = list.userId === currentUserId;
  const sharedPermission =
    !isOwned && list.shares && list.shares.length > 0 ? list.shares[0].permission : null;
  const canEdit = isOwned || sharedPermission === 'EDIT';

  const sortedTasks = [...list.tasks].sort((a, b) =>
    (b.starred ? 1 : 0) - (a.starred ? 1 : 0)
  );

  const handleDeleteList = async () => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return;
    try {
      await axios.delete(`/tasks/lists/${list.id}`);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar la lista', error);
    }
  };

  const handleUpdateList = async () => {
    try {
      await axios.put(`/tasks/lists/${list.id}`, { name: listName, pinned });
      setEditingList(false);
      onRefresh();
    } catch (error) {
      console.error('Error al actualizar la lista', error);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = !pinned;
    try {
      await axios.put(`/tasks/lists/${list.id}`, { name: listName, pinned: newPinned });
      setPinned(newPinned);
      onRefresh();
    } catch (error) {
      console.error('Error al actualizar pinned en la lista', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await axios.delete(`/tasks/lists/${list.id}/tasks/${taskId}`);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar la tarea', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setCurrentTask(null);
  };

  const handleCreateTask = () => {
    setCurrentTask(null);
    setShowTaskModal(true);
  };

  const toggleTaskCompleted = async (task: Task) => {
    try {
      await axios.put(`/tasks/lists/${list.id}/tasks/${task.id}`, { completed: !task.completed });
      onRefresh();
    } catch (error) {
      console.error('Error al actualizar estado de la tarea', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        {editingList ? (
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
          />
        ) : (
          <h3 className="text-xl font-semibold">{list.name}</h3>
        )}
        <div className="flex items-center space-x-2">
          <button onClick={handleTogglePin} title={pinned ? 'Desfijar lista' : 'Fijar lista'}>
            {pinned ? (
              <BiSolidPin className="text-2xl text-yellow-500" />
            ) : (
              <BiPin className="text-2xl text-gray-400" />
            )}
          </button>
          {canEdit && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                <BsThreeDotsVertical className="text-2xl text-gray-600 dark:text-gray-300" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setEditingList(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowShareModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Compartir
                  </button>
                  {isOwned && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleDeleteList();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        {sortedTasks.length === 0 ? (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic flex flex-col items-center">
            <p>No hay tareas en esta lista.</p>
            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTask}
                className="mt-2 hidden group-hover:flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded shadow-md transition-all duration-300"
              >
                + Añadir Tarea
              </motion.button>
            )}
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3 mt-4">
              {sortedTasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setDetailTask(task)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompleted(task);
                      }}
                      className="focus:outline-none"
                      title={task.completed ? 'Desmarcar completado' : 'Marcar como completado'}
                    >
                      {task.completed ? (
                        <BsCheckCircle className="text-green-500 text-2xl" />
                      ) : (
                        <BsCircle className="text-gray-400 text-2xl" />
                      )}
                    </button>
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {task.starred && <span className="mr-1 text-yellow-500">★</span>}
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {canEdit && (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setTaskMenuOpenId(prev => (prev === task.id ? null : task.id))} className="p-2">
                        <BsThreeDotsVertical className="text-2xl text-gray-600 dark:text-gray-300" />
                      </button>
                      {taskMenuOpenId === task.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => { handleEditTask(task); setTaskMenuOpenId(null); }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => { handleDeleteTask(task.id); setTaskMenuOpenId(null); }}
                            className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTask}
                className="mt-4 hidden group-hover:flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded shadow-md transition-all duration-300"
              >
                + Añadir Tarea
              </motion.button>
            )}
          </>
        )}
      </div>
      {showShareModal && (
        <ShareTaskListModal
          listId={list.id}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          listId={list.id}
          initialData={currentTask || undefined}
          onClose={handleCloseTaskModal}
          onTaskSaved={onRefresh}
        />
      )}
      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          onClose={() => setDetailTask(null)}
        />
      )}
    </motion.div>
  );
};

export default TaskListItem;
