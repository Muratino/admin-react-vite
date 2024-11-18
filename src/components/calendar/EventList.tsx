import React from 'react';
import { format, isWithinInterval } from 'date-fns';
import { Event, DateRange } from '../../types/calendar';

interface EventListProps {
  events: Event[];
  viewRange: DateRange;
  onEventClick: (event: Event) => void;
}

export default function EventList({ events, viewRange, onEventClick }: EventListProps) {
  const filteredEvents = events.filter(event =>
    isWithinInterval(event.start, {
      start: viewRange.start,
      end: viewRange.end
    })
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <div className="space-y-3">
        {filteredEvents.map(event => (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-500">
                  {format(event.start, 'MMM d, HH:mm')}
                </div>
              </div>
            </div>
          </button>
        ))}
        {filteredEvents.length === 0 && (
          <p className="text-gray-500 text-sm">No events scheduled</p>
        )}
      </div>
    </div>
  );
}