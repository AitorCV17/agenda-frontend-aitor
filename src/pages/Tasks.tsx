import React, { useEffect, useState } from 'react'
import axios from '../services/api'
import TaskListForm from '../components/TaskListForm'
import TaskListItem from '../components/TaskListItem'

const Tasks: React.FC = () => {
  const [taskLists, setTaskLists] = useState<any[]>([])

  const fetchTaskLists = async () => {
    try {
      const res = await axios.get('/tasks/lists')
      setTaskLists(res.data)
    } catch (err) {
      console.error('Error al obtener listas de tareas')
    }
  }

  useEffect(() => {
    fetchTaskLists()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tareas</h2>
      <TaskListForm onCreated={fetchTaskLists} />
      {taskLists.map(list => (
        <TaskListItem key={list.id} list={list} onRefresh={fetchTaskLists} />
      ))}
    </div>
  )
}

export default Tasks
