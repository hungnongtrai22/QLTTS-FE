import { Helmet } from 'react-helmet-async';
import TradeUnionEditView from 'src/sections/user/view/trade-union-edit-view';
// sections

// ----------------------------------------------------------------------

export default function TradeUnionEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trade Union Edit</title>
      </Helmet>

      <TradeUnionEditView />
    </>
  );
}
