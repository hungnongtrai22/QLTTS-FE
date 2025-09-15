import { Helmet } from 'react-helmet-async';
import GalleryEditView from 'src/sections/user/view/gallery-edit-view';
// sections

// ----------------------------------------------------------------------

export default function GalleryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Gallery Edit</title>
      </Helmet>

      <GalleryEditView />
    </>
  );
}
