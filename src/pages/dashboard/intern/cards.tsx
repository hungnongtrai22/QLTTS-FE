import { Helmet } from 'react-helmet-async';
// sections
import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function InternCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Cards</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
