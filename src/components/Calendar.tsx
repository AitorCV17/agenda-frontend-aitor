import React from 'react'

interface CalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color?: string
}

interface CalendarProps {
  events: CalendarEvent[]
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Calendario</h3>
      {events.length === 0 ? (
        <p>No hay eventos en este rango.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} className="border-b border-gray-200 py-2">
              <div style={{ color: event.color || '#000' }}>
                <p className="font-bold">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Calendar
