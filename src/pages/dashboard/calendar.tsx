import { Helmet } from 'react-helmet-async';
// sections
import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Bảng điều khiển: Điểm danh</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
