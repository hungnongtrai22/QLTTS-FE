import { Helmet } from 'react-helmet-async';
import SourceEditView from 'src/sections/user/view/source-edit-view';
// sections

// ----------------------------------------------------------------------

export default function SourceEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Source Edit</title>
      </Helmet>

      <SourceEditView />
    </>
  );
}
