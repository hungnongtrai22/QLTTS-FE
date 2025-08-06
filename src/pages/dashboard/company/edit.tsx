import { Helmet } from 'react-helmet-async';
import CompanyEditView from 'src/sections/user/view/company-new-edit-view';
// sections

// ----------------------------------------------------------------------

export default function CompanyEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Edit</title>
      </Helmet>

      <CompanyEditView />
    </>
  );
}
