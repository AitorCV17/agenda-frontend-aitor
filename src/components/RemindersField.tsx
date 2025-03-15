import React, { useState } from 'react'

interface Reminder {
  method: 'notification' | 'email'
  timeValue: number
  timeUnit: 'minutes' | 'hours' | 'days'
}

const RemindersField: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])

  const addReminder = () => {
    setReminders([...reminders, { method: 'notification', timeValue: 10, timeUnit: 'minutes' }])
  }

  const updateReminder = (index: number, updated: Partial<Reminder>) => {
    setReminders(reminders.map((r, i) => i === index ? { ...r, ...updated } : r))
  }

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 bg-gray-50 rounded">
      <button type="button" onClick={addReminder} className="bg-blue-600 text-white px-3 py-1 rounded mb-3">
        Agregar notificación
      </button>
      {reminders.map((rem, index) => (
        <div key={index} className="flex items-center mb-2">
          <select value={rem.method} onChange={(e) => updateReminder(index, { method: e.target.value as Reminder['method'] })} className="mr-2 border border-gray-300 p-1 rounded">
            <option value="notification">Notificación</option>
            <option value="email">Correo electrónico</option>
          </select>
          <input type="number" value={rem.timeValue} onChange={(e) => updateReminder(index, { timeValue: parseInt(e.target.value) })} className="w-16 mr-2 border border-gray-300 p-1 rounded" />
          <select value={rem.timeUnit} onChange={(e) => updateReminder(index, { timeUnit: e.target.value as Reminder['timeUnit'] })} className="mr-2 border border-gray-300 p-1 rounded">
            <option value="minutes">minutos</option>
            <option value="hours">horas</option>
            <option value="days">días</option>
          </select>
          <button type="button" onClick={() => removeReminder(index)} className="text-red-600 font-bold">X</button>
        </div>
      ))}
      <pre className="mt-2 text-xs bg-white p-2 rounded border border-gray-300">
        {JSON.stringify(reminders, null, 2)}
      </pre>
    </div>
  )
}

export default RemindersField;
