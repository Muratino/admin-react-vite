import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { Event } from '../../types/calendar';

interface MonthViewProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function MonthView({ date, events, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => 
    events.filter(event => isSameDay(event.start, day));

  return (
    <div className="grid grid-cols-7 h-full">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-sm font-medium text-gray-500 text-center border-b">
          {day}
        </div>
      ))}
      
      {days.map(day => (
        <div
          key={day.toString()}
          className={`min-h-[120px] p-2 border-b border-r ${
            !isSameMonth(day, date) ? 'bg-gray-50' : ''
          }`}
        >
          <div className="text-sm font-medium text-gray-500">
            {format(day, 'd')}
          </div>
          <div className="mt-1 space-y-1">
            {getEventsForDay(day).map(event => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="w-full text-left px-2 py-1 text-xs rounded-md"
                style={{ backgroundColor: `${event.color}20`, color: event.color }}
              >
                {format(event.start, 'HH:mm')} {event.title}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}