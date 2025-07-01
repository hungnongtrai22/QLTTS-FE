import { Helmet } from 'react-helmet-async';
// sections
import { CalendarView } from 'src/sections/calendar/view';
import { IInternItem } from 'src/types/user';

// ----------------------------------------------------------------------
type Props = {
  intern?: IInternItem;
};

export default function CalendarPage({ intern }: Props) {
  return (
    <>
      <Helmet>
        <title> Bảng điều khiển: Điểm danh</title>
      </Helmet>

      <CalendarView intern={intern}/>
    </>
  );
}
