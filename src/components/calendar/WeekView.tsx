import React from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addHours, startOfDay, isSameDay } from 'date-fns';
import { Event } from '../../types/calendar';

interface WeekViewProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function WeekView({ date, events, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => 
    events.filter(event => 
      isSameDay(event.start, day) && 
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
      
      <div className="flex-1 grid grid-cols-7">
        {days.map(day => (
          <div key={day.toString()} className="border-r">
            <div className="text-center py-2 border-b text-sm font-medium">
              {format(day, 'EEE d')}
            </div>
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b relative">
                {getEventsForDayAndHour(day, hour).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="absolute inset-x-1 rounded-md px-2 py-1 text-xs"
                    style={{ 
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                      top: '4px'
                    }}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}