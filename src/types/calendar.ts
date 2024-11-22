export type ViewType = 'month' | 'week' | 'day';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end: string;   // ISO string
  category?: string;
  color?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Helper functions for date conversion
export const serializeEvent = (event: Omit<Event, 'id'> & { id?: string }): Event => ({
  ...event,
  id: event.id || Date.now().toString(),
  start: event.start instanceof Date ? event.start.toISOString() : event.start,
  end: event.end instanceof Date ? event.end.toISOString() : event.end,
});