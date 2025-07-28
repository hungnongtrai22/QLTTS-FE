import { Helmet } from 'react-helmet-async';
// sections
import CalendarTradeUnionView from 'src/sections/calendar/view/calendar-trade-union-view';
import { IInternItem } from 'src/types/user';

// ----------------------------------------------------------------------
type Props = {
  intern?: IInternItem;
};

export default function CalendarViewPage({ intern }: Props) {
  return (
    <>
      <Helmet>
        <title> Bảng điều khiển: Điểm danh</title>
      </Helmet>

      <CalendarTradeUnionView intern={intern}/>
    </>
  );
}
