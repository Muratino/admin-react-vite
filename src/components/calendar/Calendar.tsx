import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, addWeeks, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ViewType, Event } from '../../types/calendar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import EventList from './EventList';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly sync with the development team',
    start: new Date(2024, 2, 15, 10, 0),
    end: new Date(2024, 2, 15, 11, 30),
    category: 'meeting',
    color: '#4F46E5'
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'New feature release',
    start: new Date(2024, 2, 20, 14, 0),
    end: new Date(2024, 2, 20, 16, 0),
    category: 'event',
    color: '#059669'
  }
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : addMonths(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : addWeeks(currentDate, -1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setShowEventModal(false);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventModal(false);
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const viewRange = {
    month: {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    },
    week: {
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate)
    },
    day: {
      start: currentDate,
      end: currentDate
    }
  }[view];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <CalendarIcon className="h-4 w-4" />
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-300 p-1">
            {(['month', 'week', 'day'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  view === v
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Events</option>
            <option value="meeting">Meetings</option>
            <option value="event">Events</option>
          </select>
          
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 overflow-auto">
          {view === 'month' && (
            <MonthView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'day' && (
            <DayView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
        </div>
        
        <div className="w-80 border-l p-4 overflow-y-auto">
          <EventList
            events={filteredEvents}
            viewRange={viewRange}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
        />
      )}
    </div>
  );
}