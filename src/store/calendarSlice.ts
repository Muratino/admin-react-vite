import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewType, Event, serializeEvent } from '../types/calendar';

interface CalendarState {
  currentDate: string;
  view: ViewType;
  events: Event[];
  selectedEvent: Event | null;
  showEventModal: boolean;
  filter: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly sync with the development team',
    start: new Date(2024, 2, 15, 10, 0).toISOString(),
    end: new Date(2024, 2, 15, 11, 30).toISOString(),
    category: 'meeting',
    color: '#4F46E5'
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'New feature release',
    start: new Date(2024, 2, 20, 14, 0).toISOString(),
    end: new Date(2024, 2, 20, 16, 0).toISOString(),
    category: 'event',
    color: '#059669'
  }
];

const initialState: CalendarState = {
  currentDate: new Date().toISOString(),
  view: 'month',
  events: mockEvents,
  selectedEvent: null,
  showEventModal: false,
  filter: 'all'
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },
    addEvent: (state, action: PayloadAction<Omit<Event, 'id'>>) => {
      const serializedEvent = serializeEvent(action.payload);
      state.events.push(serializedEvent);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const serializedEvent = serializeEvent(action.payload);
      const index = state.events.findIndex(event => event.id === serializedEvent.id);
      if (index !== -1) {
        state.events[index] = serializedEvent;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload ? serializeEvent(action.payload) : null;
    },
    setShowEventModal: (state, action: PayloadAction<boolean>) => {
      state.showEventModal = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  setCurrentDate,
  setView,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setShowEventModal,
  setFilter
} = calendarSlice.actions;

export default calendarSlice.reducer;