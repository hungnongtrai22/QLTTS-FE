import { Helmet } from 'react-helmet-async';
import OrderEditView from 'src/sections/user/view/order-edit-view';
// sections

// ----------------------------------------------------------------------

export default function OrderEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order Edit</title>
      </Helmet>

      <OrderEditView />
    </>
  );
}
