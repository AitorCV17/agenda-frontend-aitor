import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import TaskListForm from '../components/TaskListForm';
import TaskListItem from '../components/TaskListItem';
import TaskForm from '../components/TaskForm';

interface TaskList {
  id: number;
  name: string;
  pinned: boolean;
  tasks: any[];
}

const Tasks: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [refresh, setRefresh] = useState(false);

  const fetchTaskLists = async () => {
    try {
      const res = await axios.get('/tasks/lists');
      setTaskLists(res.data);
    } catch (err) {
      console.error('Error al obtener listas de tareas');
    }
  };

  useEffect(() => {
    fetchTaskLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Listas de Tareas</h2>
      <TaskListForm onCreated={handleRefresh} />

      {taskLists.map((list) => (
        <div key={list.id}>
          {/* Componente que muestra la lista y sus tareas */}
          <TaskListItem list={list} onRefresh={handleRefresh} />

          {/* Formulario para crear una tarea dentro de esta lista */}
          <div className="ml-4 mb-8">
            <TaskForm listId={list.id} onCreated={handleRefresh} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
