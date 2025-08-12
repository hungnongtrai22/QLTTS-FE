// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// utils
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { ICalendarView } from 'src/types/calendar';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  date: Date;
  view: ICalendarView;
  onToday: VoidFunction;
  onNextDate: VoidFunction;
  onPrevDate: VoidFunction;
  onOpenFilters: VoidFunction;
  onChangeView: (newView: ICalendarView) => void;
  statistics: any;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilters,
  statistics,
}: Props) {
  const smUp = useResponsive('up', 'sm');
  const { t,currentLang } = useLocales();
  console.log(currentLang);

  const VIEW_OPTIONS = [
    { value: 'dayGridMonth', label: t('month'), icon: 'mingcute:calendar-month-line' },
    { value: 'timeGridWeek', label: t('week'), icon: 'mingcute:calendar-week-line' },
    { value: 'timeGridDay', label: t('day'), icon: 'mingcute:calendar-day-line' },
    { value: 'listWeek', label: t('agenda'), icon: 'fluent:calendar-agenda-24-regular' },
  ] as const;

  const popover = usePopover();

  const selectedItem = VIEW_OPTIONS.filter((item) => item.value === view)[0];

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, pr: 2 }}
      >
        {smUp && (
          <Button
            size="small"
            color="inherit"
            onClick={popover.onOpen}
            startIcon={<Iconify icon={selectedItem.icon} />}
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" sx={{ ml: -0.5 }} />}
          >
            {selectedItem.label}
          </Button>
        )}

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={onPrevDate}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          {/* <Typography variant="h6">{fDate(date)}</Typography> */}
          <Typography variant="h6">{changDateJP(date)}</Typography>

          <IconButton onClick={onNextDate}>
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>

          <Button size="small" color="success" variant="contained">
            {statistics?.attendedDays}/{statistics?.totalSessions}
          </Button>

           <Button size="small" color="error" variant="contained" onClick={onToday}>
            {t('today')}
          </Button>

          <IconButton onClick={onOpenFilters}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Stack>

        
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-left"
        sx={{ width: 160 }}
      >
        {VIEW_OPTIONS.map((viewOption) => (
          <MenuItem
            key={viewOption.value}
            selected={viewOption.value === view}
            onClick={() => {
              popover.onClose();
              onChangeView(viewOption.value);
            }}
          >
            <Iconify icon={viewOption.icon} />
            {viewOption.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
