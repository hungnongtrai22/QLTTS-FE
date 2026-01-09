import { Helmet } from 'react-helmet-async';
import InternEditViewIsuzu from 'src/sections/user/view/intern-edit-view-isuzu';
// sections

// ----------------------------------------------------------------------

export default function InternEditIsuzuPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Edit</title>
      </Helmet>

      <InternEditViewIsuzu />
    </>
  );
}
