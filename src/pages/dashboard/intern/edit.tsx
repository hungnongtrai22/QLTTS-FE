import { Helmet } from 'react-helmet-async';
import InternEditView from 'src/sections/user/view/intern-edit-view';
// sections

// ----------------------------------------------------------------------

export default function InternEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Edit</title>
      </Helmet>

      <InternEditView />
    </>
  );
}
