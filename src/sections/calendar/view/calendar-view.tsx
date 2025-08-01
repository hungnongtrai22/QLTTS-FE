import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import allLocales from '@fullcalendar/core/locales-all';

//
import { useState, useEffect, useCallback } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
// redux
import { useDispatch } from 'src/redux/store';
import { getEvents } from 'src/redux/slices/calendar';
// types
import { ICalendarFilters, ICalendarFilterValue } from 'src/types/calendar';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { isDateError } from 'src/components/custom-date-range-picker';
import { useLocales } from 'src/locales';
import { IInternItem } from 'src/types/user';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import AllAttendancePDF from 'src/sections/order/AllAttendancePDF';

//
import { useCalendar } from '../hooks';
import { StyledCalendar } from '../styles';
import CalendarForm from '../calendar-form';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import CalendarFiltersResult from '../calendar-filters-result';
import EventForm from '../event-form';

// ----------------------------------------------------------------------

const defaultFilters = {
  colors: [],
  startDate: null,
  endDate: null,
};

function useInitial() {
  const dispatch = useDispatch();

  const getEventsCallback = useCallback(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    getEventsCallback();
  }, [getEventsCallback]);

  return null;
}

// ----------------------------------------------------------------------
type Props = {
  intern?: IInternItem;
};

export default function CalendarView({ intern }: Props) {
  useInitial();

  const { t, currentLang } = useLocales();

  const theme = useTheme();

  const settings = useSettingsContext();

  const smUp = useResponsive('up', 'sm');

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [loadingDownloadAll, setLoadingDownloadAll] = useState(false);

  // const [events, setEvents] = useState([]);
  // const [currentEvent, setCurrentEvent] = useState(events.find((event : any) => event._id === currentEventId));

  const dateError = isDateError(filters.startDate, filters.endDate);

  const {
    calendarRef,
    //
    view,
    date,
    events,
    initialEvent,
    currentEventId,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onDeleteEvent,
    onDeleteNewEvent,
    onInitialView,
    onCreateEvent,
    onCreateNewEvent,
    onUpdateEvent,
    onUpdateNewEvent,
    //
    openForm,
    openEventForm,
    onOpenForm,
    onOpenEventForm,
    onCloseForm,
    onCloseEventForm,
    statistics,
    //
    onClickEventInFilters,
  } = useCalendar({ internId: intern?._id });

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const handleFilters = useCallback((name: string, value: ICalendarFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.colors.length || (!!filters.startDate && !!filters.endDate);

  const dataFiltered = applyFilter({
    inputData: events,
    filters,
    dateError,
  });

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

 

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {/* <Typography variant="h4">Điểm Danh</Typography>
          <Button
            variant="contained"
            color='success'
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={async () => {
              try {
                setLoadingDownloadAll(true);
                const blob = await pdf(<AllAttendancePDF />).toBlob();
                saveAs(blob, `All_CVs_${intern?.name || 'Test'}.pdf`);
              } catch (error) {
                console.error('Lỗi khi tạo PDF:', error);
              } finally {
                setLoadingDownloadAll(false);
              }
            }}
          >
            Tải xuống pdf
          </Button> */}
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenEventForm}
          >
            Thêm Sự Kiện
          </Button> */}
        </Stack>

        {canReset && renderResults}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
              statistics={statistics}
            />

            <FullCalendar
              weekends
              locale={currentLang.value === 'jp' ? 'ja' : 'vi'} // <== Ngôn ngữ tiếng Nhật
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              initialEvents={events}
              select={onSelectRange}
              eventDrop={onDropEvent}
              eventClick={onClickEvent}
              eventResize={onResizeEvent}
              height={smUp ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle>
          {currentEventId ? t('edit') : t('add')} {t('event')}
        </DialogTitle>

        <CalendarForm
          openForm={openForm}
          onClose={onCloseForm}
          event={initialEvent()}
          onDeleteEvent={onDeleteEvent}
          onCreateEvent={onCreateEvent}
          onUpdateEvent={onUpdateEvent}
          onDeleteNewEvent={onDeleteNewEvent}
          onCreateNewEvent={onCreateNewEvent}
          onUpdateNewEvent={onUpdateNewEvent}
          currentEventId={currentEventId}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          // addAttendHandler={addAttendHandler}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openEventForm}
        onClose={onCloseEventForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle>
          {currentEventId ? t('edit') : t('add')} {t('event')}
        </DialogTitle>

        <EventForm
          openForm={openEventForm}
          onClose={onCloseEventForm}
          event={initialEvent()}
          onDeleteEvent={onDeleteNewEvent}
          onCreateEvent={onCreateNewEvent}
          onUpdateEvent={onUpdateNewEvent}
          currentEventId={currentEventId}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          // addAttendHandler={addAttendHandler}
        />
      </Dialog>

      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        filters={filters}
        onFilters={handleFilters}
        canReset={canReset}
        onResetFilters={handleResetFilters}
        dateError={dateError}
        events={events}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: EventInput[];
  filters: ICalendarFilters;
  dateError: boolean;
}) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event: EventInput) => colors.includes(event.color as string));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (event: EventInput) =>
          fTimestamp(event.start as Date) >= fTimestamp(startDate) &&
          fTimestamp(event.end as Date) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
