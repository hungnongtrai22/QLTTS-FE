/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import { useLocales } from 'src/locales';

// types
import { ICalendarEvent } from 'src/types/calendar';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ColorPicker } from 'src/components/color-utils';
import { isDateError } from 'src/components/custom-date-range-picker';
import FormProvider, { RHFTextField, RHFSwitch } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = ICalendarEvent;

type Props = {
  openForm: boolean;
  event: ICalendarEvent;
  onClose: VoidFunction;
  colorOptions: string[];
  currentEventId: string | null;
  onDeleteEvent: (eventId: string, attendanceId: string) => void;
  onCreateEvent: (newEvent: ICalendarEvent) => void;
  onUpdateEvent: (newEvent: ICalendarEvent) => void;
  onDeleteNewEvent: any;
  onCreateNewEvent: any;
  onUpdateNewEvent: any;
  // addAttendHandler: any;
};

// ----------------------------------------------------------------------

export default function CalendarFormView({
  event,
  onClose,
  openForm,
  colorOptions,
  onDeleteEvent,
  onCreateEvent,
  currentEventId,
  onUpdateEvent,
  onDeleteNewEvent,
  onCreateNewEvent,
  onUpdateNewEvent,
}: // addAttendHandler
Props) {
  const { enqueueSnackbar } = useSnackbar();
  // const [allDay, setAllDay] = useState(false);
  // const [am, setAM] = useState(false);
  // const [pm, setPM] = useState(false);

  const { t, currentLang } = useLocales();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: event,
  });

  const update = !!currentEventId && !!openForm;

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const values = watch();

  const dateError = isDateError(values.start, values.end);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const newEvent = {
          title: data.title,
          description: data.description,
          color: data.color,
          allDay: data.allDay,
          start: data.start,
          end: data.end,
          am: data?.am,
          pm: data?.pm,
          late: data?.late,
          soon: data?.soon,
          off: data?.off,
          attendanceId: event.attendanceId,
          _id: event._id,
        };
        // await addAttendHandler(newEvent);
        if (!dateError) {
          if (currentEventId) {
            if (event.color === '#FF5630') {
              onUpdateNewEvent(newEvent);
            } else {
              onUpdateEvent(newEvent);
            }
            enqueueSnackbar('Update success!');
          } else {
            onCreateEvent(newEvent);
            enqueueSnackbar('Create success!');
          }
          onClose();
          reset();
        }
      } catch (error) {
        console.error(error);
      }
    },
    [currentEventId, dateError, enqueueSnackbar, onClose, onCreateEvent, onUpdateEvent, reset]
  );

  const onDelete = useCallback(() => {
    try {
      onClose();
      if (event.color === '#FF5630') {
        onDeleteNewEvent(`${event.id}`, event?.attendanceId || '');
      } else {
        onDeleteEvent(`${event.id}`, event?.attendanceId || '');
      }
      enqueueSnackbar('Delete success!');
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { am, pm, allDay, start } = values;

    const currentStart = start ? new Date(start) : new Date();

    const baseDate = new Date(
      currentStart.getFullYear(),
      currentStart.getMonth(),
      currentStart.getDate()
    );

    const setTime = (hour: number, minute: number) => {
      const d = new Date(baseDate);
      d.setHours(hour, minute, 0, 0);
      return d.toISOString();
    };

    if (allDay) {
      setValue('start', setTime(8, 0));
      setValue('end', setTime(17, 0));
    } else if (am) {
      setValue('start', setTime(8, 0));
      setValue('end', setTime(11, 30));
    } else if (pm) {
      setValue('start', setTime(13, 0));
      setValue('end', setTime(17, 0));
    }
  }, [values, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label={t('title')} sx={{ pointerEvents: 'none', opacity: 1 }}/>

        <RHFTextField name="description" label={t('description')} multiline rows={3} sx={{ pointerEvents: 'none', opacity: 1 }}/>

        <Stack direction="row" display="inline-flex">
          <Controller
            name="am"
            control={control}
            render={({ field }) => <RHFSwitch label={t('morning')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
          <Controller
            name="pm"
            control={control}
            render={({ field }) => <RHFSwitch label={t('afternoon')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
          <Controller
            name="allDay"
            control={control}
            render={({ field }) => <RHFSwitch label={t('allDay')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
        </Stack>

        <Stack direction="row" display="inline-flex">
          <Controller
            name="off"
            control={control}
            render={({ field }) => <RHFSwitch label={t('off')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
          <Controller
            name="late"
            control={control}
            render={({ field }) => <RHFSwitch label={t('late')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
          <Controller
            name="soon"
            control={control}
            render={({ field }) => <RHFSwitch label={t('soon')} {...field} sx={{ pointerEvents: 'none', opacity: 1 }}/>}
          />
        </Stack>

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as Date)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(new Date(newValue).toISOString());
                }
              }}
              label={t('start_date')}
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
              sx={{ pointerEvents: 'none', opacity: 1 }}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as Date)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(new Date(newValue).toISOString());
                }
              }}
              label={t('end_date')}
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError && 'End date must be later than start date',
                },
              }}
              sx={{ pointerEvents: 'none', opacity: 1 }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value}
              onSelectColor={field.onChange}
              colors={colorOptions}
              sx={{ pointerEvents: 'none', opacity: 1 }}
            />
          )}
        />
      </Stack>
{/* 
      <DialogActions>
        {update && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          {t('submit')}
        </LoadingButton>
      </DialogActions> */}
    </FormProvider>
  );
}
