/* eslint-disable no-empty */
import merge from 'lodash/merge';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { useState, useCallback, useRef, useEffect } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { createEvent, updateEvent, deleteEvent } from 'src/redux/slices/calendar';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
// types
import { ICalendarEvent, ICalendarView } from 'src/types/calendar';
import axios from 'axios';

// ----------------------------------------------------------------------
type Props = {
  internId?: string;
};

export default function useCalendar({ internId }: Props) {
  const calendarRef = useRef<FullCalendar>(null);

  const calendarEl = calendarRef.current;

  const smUp = useResponsive('up', 'sm');

  const dispatch = useDispatch();

  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [date, setDate] = useState(new Date());

  const [openForm, setOpenForm] = useState(false);
  const [openEventForm, setOpenEventForm] = useState(false);

  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const [statistics, setStatistics] = useState(null);

  console.log(currentEventId);

  const [view, setView] = useState<ICalendarView>(smUp ? 'dayGridMonth' : 'listWeek');

  // const { events: eventData } = useSelector((state) => state.calendar);
  const [eventData, setEventData] = useState<any[]>([]);

  const getAttendaceByMonth = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/attendance/getAllAttendByInternId`,
      {
        internId,
      }
    );

    const { data: newData } = await axios.get(
      `${process.env.REACT_APP_HOST_API}/api/event/getAllEventByInternId`
    );
    if (data) {
      setEventData([...data.attend, ...newData.attend]);
    } else {
      setEventData([]);
    }
  }, [internId]);

  const getStatisticsHandler = useCallback(
    async () => {
      // console.log("Month",date.getMonth());
      // console.log("Year",date.getFullYear());
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/attendance/statistics`,
        {
          internId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        }
      );
      setStatistics(data);
    },
    [date, internId]
    // [date]
  );

  const addAttendHandler = useCallback(
    async (attendItem: any) => {
      // console.log('Month', new Date(attendItem.start).getMonth());
      // console.log("Year",date.getFullYear());
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/attendance/create`, {
        internId,
        attendItem,
        month: new Date(attendItem.start).getMonth() + 1,
        year: new Date(attendItem.start).getFullYear(),
      });
      await getAttendaceByMonth();
    },
    [ internId, getAttendaceByMonth]
    // [date]
  );

  const addEventHandler = useCallback(
    async (attendItem: any) => {
      // console.log("Month",date.getMonth());
      // console.log("Year",date.getFullYear());
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/event/create`, {
        attendItem,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
      await getAttendaceByMonth();
    },
    [date, getAttendaceByMonth]
    // [date]
  );

  const editAttendHandler = useCallback(
    async (attendItem: any) => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/attendance/updateAttendItem`,
        {
          _id: attendItem.attendanceId,
          itemId: attendItem._id,
          updateData: attendItem,
          internId,
        }
      );
      await getAttendaceByMonth();
    },
    [getAttendaceByMonth, internId]
  );

  const editEventHandler = useCallback(
    async (attendItem: any) => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/event/updateEventItem`,
        {
          _id: attendItem.attendanceId,
          itemId: attendItem._id,
          updateData: attendItem,
        }
      );
      await getAttendaceByMonth();
    },
    [getAttendaceByMonth]
    // [date]
  );

  const removeAttendHandler = useCallback(
    async (eventId: any, attendanceId: any) => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/attendance/deleteAttendItem`,
        {
          _id: attendanceId,
          itemId: eventId,
          internId,
        }
      );
      await getAttendaceByMonth();
    },
    [getAttendaceByMonth, internId]
  );

  const removeEventHandler = useCallback(
    async (eventId: any, attendanceId: any) => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/event/deleteEventItem`,
        {
          _id: attendanceId,
          itemId: eventId,
        }
      );
      await getAttendaceByMonth();
    },
    [getAttendaceByMonth]
  );

  useEffect(() => {
    getAttendaceByMonth();
    getStatisticsHandler();
  }, [date, getAttendaceByMonth, getStatisticsHandler]);

  const events =
    eventData?.map((event: any) => ({
      ...event,
      textColor: event.color,
      id: event._id,
    })) || [];

  const currentEvent = useSelector(() => {
    if (currentEventId) {
      return events.find((event: any) => event.id === currentEventId);
    }

    return null;
  });

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const onOpenEventForm = useCallback(() => {
    setOpenEventForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedRange(null);
    setCurrentEventId(null);
  }, []);

  const onCloseEventForm = useCallback(() => {
    setOpenEventForm(false);
    setSelectedRange(null);
    setCurrentEventId(null);
  }, []);

  const onInitialView = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarEl, smUp]);

  const onChangeView = useCallback(
    (newView: ICalendarView) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarEl]
  );

  const onDateToday = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDatePrev = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDateNext = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onSelectRange = useCallback(
    (arg: DateSelectArg) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.unselect();
      }
      onOpenForm();
      setSelectedRange({
        start: arg.start,
        end: arg.end,
      });
    },
    [calendarEl, onOpenForm]
  );

  const onClickEvent = useCallback(
    (arg: any) => {
      onOpenForm();
      console.log('Event', arg);
      setCurrentEventId(arg.event.id);
    },
    [onOpenForm]
  );

  const onResizeEvent = useCallback(
    ({ event }: any) => {
      try {
        dispatch(
          updateEvent(event.id, {
            allDay: event.allDay,
            start: event.start,
            end: event.end,
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const onDropEvent = useCallback(
    ({ event }: any) => {
      try {
        dispatch(
          updateEvent(event.id, {
            allDay: event.allDay,
            start: event.start,
            end: event.end,
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const onCreateEvent = useCallback(
    async (newEvent: ICalendarEvent) => {
      await addAttendHandler(newEvent);
      dispatch(createEvent(newEvent));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const onCreateNewEvent = useCallback(
    async (newEvent: ICalendarEvent) => {
      await addEventHandler(newEvent);
      dispatch(createEvent(newEvent));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const onUpdateEvent = useCallback(
    async (newEvent: ICalendarEvent) => {
      if (currentEventId) {
        await editAttendHandler(newEvent);
        dispatch(updateEvent(currentEventId, newEvent));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, currentEventId]
  );

  const onUpdateNewEvent = useCallback(
    async (newEvent: ICalendarEvent) => {
      if (currentEventId) {
        await editEventHandler(newEvent);
        dispatch(updateEvent(currentEventId, newEvent));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, currentEventId]
  );

  const onDeleteEvent = useCallback(
    async (eventId: string, attendanceId: string) => {
      await removeAttendHandler(eventId, attendanceId);
      dispatch(deleteEvent(eventId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const onDeleteNewEvent = useCallback(
    async (eventId: string, attendanceId: string) => {
      await removeEventHandler(eventId, attendanceId);
      dispatch(deleteEvent(eventId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const onClickEventInFilters = useCallback(
    (eventId: string) => {
      if (eventId) {
        onOpenForm();
        setCurrentEventId(eventId);
      }
    },
    [onOpenForm]
  );

  const initialEvent = useCallback(() => {
    const initial: ICalendarEvent = {
      title: '',
      description: '',
      color: CALENDAR_COLOR_OPTIONS[1],
      allDay: false,
      start: selectedRange ? new Date(selectedRange.start).toISOString() : new Date().toISOString(),
      end: selectedRange ? new Date(selectedRange.end).toISOString() : new Date().toISOString(),
    };

    if (currentEvent || selectedRange) {
      return merge({}, initial, currentEvent);
    }

    return initial;
  }, [currentEvent, selectedRange]);

  return {
    calendarRef,
    //
    view,
    date,
    events,
    statistics,
    initialEvent,
    currentEvent,
    currentEventId,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onInitialView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onDeleteEvent,
    onCreateEvent,
    onUpdateEvent,
    onDeleteNewEvent,
    onCreateNewEvent,
    onUpdateNewEvent,
    //
    openForm,
    openEventForm,
    onOpenForm,
    onOpenEventForm,
    onCloseForm,
    onCloseEventForm,
    //
    onClickEventInFilters,
  };
}
