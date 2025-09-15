// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { IInternItem } from 'src/types/user';

//
import InternGalleryForm from '../intern-gallery-form';

// ----------------------------------------------------------------------

export default function GalleryEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const currentUser = _userList.find((user) => user.id === id);
  const [gallery, setGallery] = useState();

  const handleGetGalleryById = useCallback(async () => {
    const {data} = await axios(`${process.env.REACT_APP_HOST_API}/api/gallery/${id}`);
    // console.log(data.intern);
    setGallery(data.gallery);
  },[id]);

  useEffect(()=>{
    handleGetGalleryById();
  },[handleGetGalleryById])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {gallery && <InternGalleryForm currentGallery={gallery} />}
    </Container>
  );
}
