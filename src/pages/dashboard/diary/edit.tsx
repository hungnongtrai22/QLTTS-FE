import { Helmet } from 'react-helmet-async';
import DiaryEditView from 'src/sections/user/view/company-edit-view';
// sections

// ----------------------------------------------------------------------

export default function DiaryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Diary Edit</title>
      </Helmet>

      <DiaryEditView />
    </>
  );
}
