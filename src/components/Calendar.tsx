import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventDetailModal from './EventDetailModal';
import DayEventsModal from './DayEventsModal';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export interface CalendarEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
  userId: number;
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateChange?: (range: { start: string; end: string }) => void;
}

type ViewMode = 'month' | 'week' | 'day';

function getSoftColor(hexColor?: string): string {
  if (!hexColor) return '#ffffff';
  if (hexColor.startsWith('#') && hexColor.length === 7) return hexColor + '33';
  return hexColor;
}

function getBorderColor(hexColor?: string): string {
  if (!hexColor) return '#99999966';
  if (hexColor.startsWith('#') && hexColor.length === 7) return hexColor + '66';
  return hexColor;
}

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const EnhancedCalendar: React.FC<CalendarProps> = ({ events, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dayDetail, setDayDetail] = useState<{ dateStr: string; events: CalendarEvent[] } | null>(null);
  const [view, setView] = useState<ViewMode>('month');
  const [goToDate, setGoToDate] = useState(currentDate.format('YYYY-MM-DD'));

  useEffect(() => {
    let startDate: string, endDate: string;
    if (view === 'month') {
      startDate = currentDate.startOf('month').toISOString();
      endDate = currentDate.endOf('month').toISOString();
    } else if (view === 'week') {
      startDate = currentDate.startOf('week').toISOString();
      endDate = currentDate.endOf('week').toISOString();
    } else {
      startDate = currentDate.startOf('day').toISOString();
      endDate = currentDate.endOf('day').toISOString();
    }
    if (onDateChange) onDateChange({ start: startDate, end: endDate });
  }, [currentDate, view, onDateChange]);

  const prevPeriod = () => {
    if (view === 'month') setCurrentDate(currentDate.subtract(1, 'month'));
    else if (view === 'week') setCurrentDate(currentDate.subtract(1, 'week'));
    else setCurrentDate(currentDate.subtract(1, 'day'));
  };

  const nextPeriod = () => {
    if (view === 'month') setCurrentDate(currentDate.add(1, 'month'));
    else if (view === 'week') setCurrentDate(currentDate.add(1, 'week'));
    else setCurrentDate(currentDate.add(1, 'day'));
  };

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const start = dayjs(event.startTime);
      const end = dayjs(event.endTime);
      let current = start;
      while (current.isBefore(end) || current.isSame(end, 'day')) {
        const dateStr = current.format('YYYY-MM-DD');
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(event);
        current = current.add(1, 'day');
      }
    });
    return map;
  }, [events]);

  const renderMonthDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const startDay = startOfMonth.day();
    const totalCells = startDay + daysInMonth;
    const todayStr = dayjs().format('YYYY-MM-DD');
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        cells.push(
          <div key={`empty-${i}`} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
        );
        continue;
      }
      const day = i - startDay + 1;
      const dateObj = currentDate.date(day);
      const dateStr = dateObj.format('YYYY-MM-DD');
      const dayEvents = eventsByDate[dateStr] || [];
      const isToday = dateStr === todayStr;

      cells.push(
        <motion.div key={`day-${day}`} whileHover={{ scale: 1.02 }} className={`flex flex-col border border-gray-200 dark:border-gray-700 p-2 transition-all duration-300 ${isToday ? 'bg-azure-50 dark:bg-azure-900' : 'bg-white dark:bg-gray-900'}`}>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer" onClick={() => { if (dayEvents.length > 0) setDayDetail({ dateStr, events: dayEvents }); }}>
            {day}
          </div>
          <div className="flex flex-col gap-1">
            {dayEvents.slice(0, 2).map(event => {
              const bg = getSoftColor(event.color);
              const border = getBorderColor(event.color);
              return (
                <motion.div key={event.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.3 }} className="relative border rounded-xl p-1 shadow-md hover:shadow-lg backdrop-blur-sm cursor-pointer" style={{ backgroundColor: bg, borderColor: border, borderWidth: '1px' }} title={event.title} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{event.title}</p>
                </motion.div>
              );
            })}
            {dayEvents.length > 2 && (
              <button onClick={(e) => { e.stopPropagation(); setDayDetail({ dateStr, events: dayEvents }); }} className="text-xs text-azure-700 dark:text-azure-300 mt-1 underline hover:opacity-80">
                Ver {dayEvents.length - 2} más...
              </button>
            )}
          </div>
        </motion.div>
      );
    }
    return cells;
  };

  const renderMonthView = () => (
    <div>
      <div className="grid grid-cols-7 gap-px">
        {daysOfWeek.map(dayName => (
          <div key={dayName} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
            {dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {renderMonthDays()}
      </div>
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf('week');
    const days = Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
    const todayStr = dayjs().format('YYYY-MM-DD');

    return (
      <div>
        <div className="grid grid-cols-7 gap-px">
          {daysOfWeek.map(dayName => (
            <div key={dayName} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dateStr = day.format('YYYY-MM-DD');
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === todayStr;

            return (
              <motion.div key={dateStr} whileHover={{ scale: 1.02 }} className={`flex flex-col border border-gray-200 dark:border-gray-700 p-2 transition-all duration-300 ${isToday ? 'bg-azure-50 dark:bg-azure-900' : 'bg-white dark:bg-gray-900'}`}>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer" onClick={() => { if (dayEvents.length > 0) setDayDetail({ dateStr, events: dayEvents }); }}>
                  {day.format('ddd D')}
                </div>
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 2).map(event => {
                    const bg = getSoftColor(event.color);
                    const border = getBorderColor(event.color);
                    return (
                      <motion.div key={event.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.3 }} className="relative border rounded-xl p-1 shadow-md hover:shadow-lg backdrop-blur-sm cursor-pointer" style={{ backgroundColor: bg, borderColor: border, borderWidth: '1px' }} title={event.title} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{event.title}</p>
                      </motion.div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <button onClick={(e) => { e.stopPropagation(); setDayDetail({ dateStr, events: dayEvents }); }} className="text-xs text-azure-700 dark:text-azure-300 mt-1 underline hover:opacity-80">
                      Ver {dayEvents.length - 2} más...
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.format('YYYY-MM-DD');
    const dayEvents = eventsByDate[dateStr] || [];

    return (
      <div className="flex flex-col">
        {/* Día completo aquí */}
      </div>
    );
  };

  const renderView = () => {
    if (view === 'month') return renderMonthView();
    if (view === 'week') return renderWeekView();
    if (view === 'day') return renderDayView();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full transition-all duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevPeriod} className="text-sm text-gray-600 dark:text-gray-400 hover:text-azure-700 dark:hover:text-azure-300 transition">&lt;</button>
          <button onClick={nextPeriod} className="text-sm text-gray-600 dark:text-gray-400 hover:text-azure-700 dark:hover:text-azure-300 transition">&gt;</button>
        </div>
        <div className="flex items-center gap-2">
          <select value={view} onChange={(e) => setView(e.target.value as ViewMode)} className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm">
            <option value="month">Mes</option>
            <option value="week">Semana</option>
            <option value="day">Día</option>
          </select>
          <input type="date" value={goToDate} onChange={(e) => setGoToDate(e.target.value)} className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm" />
          <button onClick={() => { const newDate = dayjs(goToDate); if (newDate.isValid()) setCurrentDate(newDate); }} className="text-sm text-azure-700 hover:underline">Ir</button>
        </div>
      </div>

      <div className="mb-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
        {view === 'month' && currentDate.format('MMMM [de] YYYY')}
        {view === 'week' && `Semana de ${currentDate.startOf('week').format('D MMM')} - ${currentDate.endOf('week').format('D MMM, YYYY')}`}
        {view === 'day' && currentDate.format('dddd, D [de] MMMM [de] YYYY')}
      </div>

      {renderView()}

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dayDetail && (
          <DayEventsModal dayDetail={dayDetail} onClose={() => setDayDetail(null)} onSelectEvent={(ev) => setSelectedEvent(ev)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedCalendar;
