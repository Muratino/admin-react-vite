import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, addWeeks, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ViewType, Event } from '../../types/calendar';
import { RootState } from '../../store/store';
import {
  setCurrentDate,
  setView,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setShowEventModal,
  setFilter
} from '../../store/calendarSlice';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import EventList from './EventList';

export default function Calendar() {
  const dispatch = useDispatch();
  const {
    currentDate,
    view,
    events,
    selectedEvent,
    showEventModal,
    filter
  } = useSelector((state: RootState) => state.calendar);

  const currentDateObj = new Date(currentDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    if (view === 'month') {
      newDate = direction === 'next' ? addMonths(currentDateObj, 1) : addMonths(currentDateObj, -1);
    } else if (view === 'week') {
      newDate = direction === 'next' ? addWeeks(currentDateObj, 1) : addWeeks(currentDateObj, -1);
    } else {
      newDate = direction === 'next' ? addDays(currentDateObj, 1) : addDays(currentDateObj, -1);
    }
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const handleEventClick = (event: Event) => {
    dispatch(setSelectedEvent(event));
    dispatch(setShowEventModal(true));
  };

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    dispatch(addEvent(newEvent));
    dispatch(setShowEventModal(false));
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    dispatch(updateEvent(updatedEvent));
    dispatch(setShowEventModal(false));
  };

  const handleDeleteEvent = (eventId: string) => {
    dispatch(deleteEvent(eventId));
    dispatch(setShowEventModal(false));
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const viewRange = {
    month: {
      start: startOfMonth(currentDateObj),
      end: endOfMonth(currentDateObj)
    },
    week: {
      start: startOfWeek(currentDateObj),
      end: endOfWeek(currentDateObj)
    },
    day: {
      start: currentDateObj,
      end: currentDateObj
    }
  }[view];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setCurrentDate(new Date().toISOString()))}
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
            {format(currentDateObj, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-300 p-1">
            {(['month', 'week', 'day'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => dispatch(setView(v))}
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
            onChange={(e) => dispatch(setFilter(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Events</option>
            <option value="meeting">Meetings</option>
            <option value="event">Events</option>
          </select>
          
          <button
            onClick={() => {
              dispatch(setSelectedEvent(null));
              dispatch(setShowEventModal(true));
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
              date={currentDateObj}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              date={currentDateObj}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'day' && (
            <DayView
              date={currentDateObj}
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
          onClose={() => dispatch(setShowEventModal(false))}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
        />
      )}
    </div>
  );
}