export type ViewType = 'month' | 'week' | 'day';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  category?: string;
  color?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}