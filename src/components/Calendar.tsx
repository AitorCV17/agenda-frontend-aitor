import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface CalendarEvent {
  id: number
  title: string
  startTime: string // ISO date string
  endTime: string // ISO date string
  color?: string
}

interface CalendarProps {
  events: CalendarEvent[]
}

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Agrupar eventos por fecha YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach(event => {
      const date = new Date(event.startTime).toISOString().split('T')[0]
      if (!map[date]) map[date] = []
      map[date].push(event)
    })
    return map
  }, [events])

  const renderCells = () => {
    const cells = []
    const totalCells = startDay + daysInMonth
    const todayStr = new Date().toISOString().split('T')[0]

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        cells.push(<div key={`empty-${i}`} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />)
        continue
      }

      const day = i - startDay + 1
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateStr = dateObj.toISOString().split('T')[0]
      const dayEvents = eventsByDate[dateStr] || []
      const isToday = dateStr === todayStr

      cells.push(
        <motion.div
          key={`day-${day}`}
          whileHover={{ scale: 1.02 }}
          className={`flex flex-col justify-between border border-gray-200 dark:border-gray-700 p-2 transition-all duration-300 ${isToday ? 'bg-azure-50 dark:bg-azure-900' : 'bg-white dark:bg-gray-900'}`}
        >
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {day}
          </div>
          <div className="flex flex-col gap-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs text-white px-1 py-0.5 rounded"
                style={{ backgroundColor: event.color || '#5179a6' }}
                title={event.title}
              >
                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.title}
              </div>
            ))}
          </div>
        </motion.div>
      )
    }
    return cells
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full transition-all duration-500">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-azure-700 dark:hover:text-azure-300 transition-all">
          &lt; Mes anterior
        </button>
        <h2 className="text-xl font-bold text-azure-700 dark:text-azure-300">
          {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-azure-700 dark:hover:text-azure-300 transition-all">
          Mes siguiente &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {renderCells()}
      </div>
    </div>
  )
}

export default Calendar;
