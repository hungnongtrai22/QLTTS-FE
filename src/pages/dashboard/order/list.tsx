import { Helmet } from 'react-helmet-async';
// sections
import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Bảng Điều Khiển: Danh sách đơn hàng</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
