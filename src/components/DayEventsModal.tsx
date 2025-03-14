import React from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { CalendarEvent } from './Calendar';

interface DayEventsModalProps {
  dayDetail: {
    dateStr: string;
    events: CalendarEvent[];
  };
  onClose: () => void;
  onSelectEvent: (ev: CalendarEvent) => void;
}

function getSoftColor(hexColor?: string): string {
  if (!hexColor) return '#ffffff';
  if (hexColor.startsWith('#') && hexColor.length === 7) {
    return hexColor + '33';
  }
  return hexColor;
}

function getBorderColor(hexColor?: string): string {
  if (!hexColor) return '#99999966';
  if (hexColor.startsWith('#') && hexColor.length === 7) {
    return hexColor + '66';
  }
  return hexColor;
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({ dayDetail, onClose, onSelectEvent }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-2"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-lg shadow-xl p-6 relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-2xl font-bold hover:text-red-500 focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Eventos del día {dayjs(dayDetail.dateStr).format('D [de] MMMM [de] YYYY')}
        </h2>
        {dayDetail.events.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No hay eventos este día.</p>
        ) : (
          <ul className="space-y-2">
            {dayDetail.events.map(ev => {
              const bg = getSoftColor(ev.color);
              const border = getBorderColor(ev.color);
              return (
                <li
                  key={ev.id}
                  className="relative border rounded-xl p-2 shadow-md hover:shadow-lg backdrop-blur-sm cursor-pointer transition"
                  style={{ backgroundColor: bg, borderColor: border, borderWidth: '1px' }}
                  onClick={() => {
                    onSelectEvent(ev);
                    onClose();
                  }}
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {dayjs(ev.startTime).format('HH:mm')} - {dayjs(ev.endTime).format('HH:mm')}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DayEventsModal;
