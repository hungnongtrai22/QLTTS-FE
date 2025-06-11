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
import axios from 'axios';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
// import ProfileFollowers from '../profile-followers';
import InternViewForm from '../intern-view-form';
import InternOtherForm from '../intern-other-form';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Thông Tin',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'followers',
    label: 'Sơ yếu lý lịch',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: 'friends',
    label: 'Thông tin bổ sung',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function InternProfileView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const [intern, setIntern] = useState<IInternItem>();

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

  useEffect(() => {
    handleGetInternById();
  }, [handleGetInternById]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: intern?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
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

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome currentIntern={intern} info={_userAbout} posts={_userFeeds} />
      )}

      {currentTab === 'followers' && <InternViewForm currentIntern={intern} />}

      {currentTab === 'friends' && (
        // <ProfileFriends
        //   friends={_userFriends}
        //   searchFriends={searchFriends}
        //   onSearchFriends={handleSearchFriends}
        // />
        <InternOtherForm currentIntern={intern} />
      )}

      {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />}
    </Container>
  );
}
