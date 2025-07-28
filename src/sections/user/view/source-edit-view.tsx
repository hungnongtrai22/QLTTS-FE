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
import {  ISourceItem } from 'src/types/user';

//
import SourceNewEditForm from '../source-new-edit-form';

// ----------------------------------------------------------------------

export default function SourceEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const currentUser = _userList.find((user) => user.id === id);
  const [source, setSource] = useState<ISourceItem>();

  const handleGetSourceById = useCallback(async () => {
    const {data} = await axios(`${process.env.REACT_APP_HOST_API}/api/source/${id}`);
    console.log("SOURCE",data.source);
    setSource(data.source);
  },[id]);

  useEffect(()=>{
    handleGetSourceById();
  },[handleGetSourceById])

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
            href: paths.dashboard.source.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {source && <SourceNewEditForm currentSource={source} />}
    </Container>
  );
}
