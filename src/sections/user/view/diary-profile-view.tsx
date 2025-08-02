// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {  ICompanyItem, IDiaryItem } from 'src/types/user';

//
import DiaryViewForm from '../diary-view-form';

// ----------------------------------------------------------------------

export default function DiaryProfileView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const [diary, setDiary] = useState<IDiaryItem>();

  const handleGetDiaryById = useCallback(async () => {
    const {data} = await axios(`${process.env.REACT_APP_HOST_API}/api/diary/${id}`);
    setDiary(data.diary);
  },[id]);

  useEffect(()=>{
    handleGetDiaryById();
  },[handleGetDiaryById])

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
            href: paths.dashboard.diary.root,
          },
          { name: diary?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {diary && <DiaryViewForm currentDiary={diary} />}
    </Container>
  );
}
