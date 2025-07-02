import { EventInput } from '@fullcalendar/core';

// ----------------------------------------------------------------------

export type ICalendarFilterValue = string[] | Date | null;

export type ICalendarFilters = {
  colors: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarEvent = {
  id?: string;
  _id?: string;

  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: Date | string | null;
  end: Date | string | null;
  pm?: boolean;
  am?: boolean;
};

export type ICalendarState = {
  events: EventInput[];
};
