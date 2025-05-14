import { Helmet } from 'react-helmet-async';
import InternEditView from 'src/sections/user/view/intern-edit-view';
// sections
import UserEditView from 'src/sections/user/view/user-edit-view';

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
