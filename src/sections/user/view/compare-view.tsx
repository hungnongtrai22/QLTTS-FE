import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useParams } from 'src/routes/hook';
// _mock
import { _userAbout, _userFeeds, _userFriends, _userGallery } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { IInternItem } from 'src/types/user';
import CalendarPage from 'src/pages/dashboard/calendar';
import { useAuthContext } from 'src/auth/hooks';
import CalendarViewPage from 'src/pages/dashboard/calendar-view';

import axios from 'axios';
import { t } from 'i18next';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';

// import ProfileFollowers from '../profile-followers';

import ProfileCompare from '../profile-compare';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function CompareView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { user } = useAuthContext();



  const { id } = params;

  const [intern, setIntern] = useState<IInternItem>();
  const [galleries, setGalleries] = useState([]);

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFriends(event.target.value);
  }, []);

  const handleGetInternById = useCallback(async () => {
    const { data } = await axios(`${process.env.REACT_APP_HOST_API}/api/user/${id}`);
    setIntern(data.intern);
  }, [id]);

  const handleGetGalleryByInternId = useCallback(async () => {
    const { data } = await axios(`${process.env.REACT_APP_HOST_API}/api/gallery/listByInternId?internId=${id}`);
    setGalleries(data.galleries);
  }, [id]);

  useEffect(() => {
    handleGetInternById();
    handleGetGalleryByInternId();
  }, [handleGetInternById, handleGetGalleryByInternId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('profile') || ''}
        links={[
          { name: t('dashboard') || '', href: paths.dashboard.root },
          { name: t('intern') || '', href: paths.dashboard.user.root },
          { name: intern?.namejp },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={intern?.namejp || ''}
          name={intern?.name || ''}
          avatarUrl={intern?.avatar || ''}
          coverUrl={_userAbout.coverUrl}
        />

     
      </Card> */}

     
        <ProfileCompare currentIntern={intern} info={_userAbout} posts={_userFeeds} />
  
       
      

    
    </Container>
  );
}
