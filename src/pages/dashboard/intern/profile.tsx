import { Helmet } from 'react-helmet-async';
// sections
import InternProfileView from 'src/sections/user/view/intern-profile-view';

// ----------------------------------------------------------------------

export default function InternProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      <InternProfileView />
    </>
  );
}
