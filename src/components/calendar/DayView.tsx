import React from 'react';
import { format, addHours, startOfDay, isSameDay } from 'date-fns';
import { Event } from '../../types/calendar';

interface DayViewProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function DayView({ date, events, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => 
    events.filter(event => 
      isSameDay(event.start, date) && 
      event.start.getHours() === hour
    );

  return (
    <div className="flex h-full">
      <div className="w-16 border-r">
        {hours.map(hour => (
          <div key={hour} className="h-20 border-b text-xs text-gray-500 text-right pr-2 pt-1">
            {format(addHours(startOfDay(date), hour), 'HH:mm')}
          </div>
        ))}
      </div>
      
      <div className="flex-1">
        {hours.map(hour => (
          <div key={hour} className="h-20 border-b relative">
            {getEventsForHour(hour).map(event => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="absolute inset-x-4 rounded-md px-3 py-2 text-sm"
                style={{ 
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                  top: '4px'
                }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-75">
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}