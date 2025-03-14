import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../services/api';
import {
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const dashboardText = {
  dashboardTitle: 'Dashboard',
  stats: {
    events: 'Eventos',
    notes: 'Notas',
    taskLists: 'Listas de Tareas',
    tasks: 'Tareas'
  },
  lastCreatedTitle: 'Últimos elementos creados',
  lastCreated: {
    event: 'Último Evento',
    note: 'Última Nota',
    taskList: 'Última Lista de Tareas',
    task: 'Última Tarea'
  },
  upcomingEventsTitle: 'Próximos eventos',
  noUpcomingEvents: 'No hay eventos próximos',
  loadingData: 'Cargando datos...',
  noDataFor: (item: string) => `No hay ${item.toLowerCase()}`,
  errorFetching: 'Error al obtener datos del dashboard'
};

interface DashboardData {
  counts: {
    notes: number;
    events: number;
    taskLists: number;
    tasks: number;
  };
  lastCreated: {
    event: { id: number; title: string; startTime: string } | null;
    note: { id: number; title: string; createdAt: string } | null;
    taskList: { id: number; name: string; createdAt: string } | null;
    task: { id: number; title: string; createdAt: string } | null;
  };
  upcomingEvents: Array<{
    id: number;
    title: string;
    startTime: string;
    endTime: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/dashboard');
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || dashboardText.errorFetching);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const StatCard = ({
    title,
    count,
    Icon,
    gradient
  }: {
    title: string;
    count: number;
    Icon: any;
    gradient: string;
  }) => (
    <motion.div
      className={`aspect-square ${gradient} text-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 flex flex-col items-center justify-center`}
      whileHover={{ scale: 1.05 }}
    >
      <Icon className="text-4xl mb-1 opacity-90" />
      <p className="text-4xl font-bold">{count}</p>
      <p className="text-base font-medium">{title}</p>
    </motion.div>
  );

  const LastCreatedCard = ({
    title,
    item,
    labelKey,
    dateKey
  }: {
    title: string;
    item: any;
    labelKey: string;
    dateKey: string;
  }) => (
    <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md h-full flex flex-col justify-between">
      <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
      {item ? (
        <div className="mt-2">
          <p className="text-gray-600 dark:text-gray-400 text-lg">{item[labelKey]}</p>
          <p className="text-sm text-gray-500">{new Date(item[dateKey]).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">{dashboardText.noDataFor(title)}</p>
      )}
    </div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto mb-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-azure-700 dark:text-azure-300"
        >
          {dashboardText.dashboardTitle}
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {data ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title={dashboardText.stats.events}
                  count={data.counts.events}
                  Icon={HiOutlineCalendar}
                  gradient="bg-gradient-to-r from-azure-400 to-azure-600 dark:from-azure-700 dark:to-azure-900"
                />
                <StatCard
                  title={dashboardText.stats.notes}
                  count={data.counts.notes}
                  Icon={HiOutlineDocumentText}
                  gradient="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-900"
                />
                <StatCard
                  title={dashboardText.stats.taskLists}
                  count={data.counts.taskLists}
                  Icon={HiOutlineClipboardList}
                  gradient="bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-900"
                />
                <StatCard
                  title={dashboardText.stats.tasks}
                  count={data.counts.tasks}
                  Icon={HiOutlineCheckCircle}
                  gradient="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-700 dark:to-yellow-900"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{dashboardText.loadingData}</span>
              </div>
            )}
          </div>

          {data && (
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
                {dashboardText.lastCreatedTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <LastCreatedCard
                  title={dashboardText.lastCreated.event}
                  item={data.lastCreated.event}
                  labelKey="title"
                  dateKey="startTime"
                />
                <LastCreatedCard
                  title={dashboardText.lastCreated.note}
                  item={data.lastCreated.note}
                  labelKey="title"
                  dateKey="createdAt"
                />
                <LastCreatedCard
                  title={dashboardText.lastCreated.taskList}
                  item={data.lastCreated.taskList}
                  labelKey="name"
                  dateKey="createdAt"
                />
                <LastCreatedCard
                  title={dashboardText.lastCreated.task}
                  item={data.lastCreated.task}
                  labelKey="title"
                  dateKey="createdAt"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-azure-700 dark:text-azure-300 mb-6">
              {dashboardText.upcomingEventsTitle}
            </h3>

            {data ? (
              data.upcomingEvents.length > 0 ? (
                <ul className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-azure-500 scrollbar-track-gray-200 dark:scrollbar-thumb-azure-700 dark:scrollbar-track-gray-800">
                  {data.upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">{dashboardText.noUpcomingEvents}</p>
              )
            ) : (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{dashboardText.loadingData}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
