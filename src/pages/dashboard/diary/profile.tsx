import { Helmet } from 'react-helmet-async';
import DiaryEditView from 'src/sections/user/view/company-edit-view';
// sections

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Diary Profile</title>
      </Helmet>

      <DiaryEditView />
    </>
  );
}
