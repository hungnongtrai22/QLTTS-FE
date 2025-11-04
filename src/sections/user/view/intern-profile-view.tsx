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
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
// import ProfileFollowers from '../profile-followers';
import InternViewForm from '../intern-view-form';
import InternOtherForm from '../intern-other-form';
import InternPointForm from '../intern-point-form';
import InternStatusForm from '../intern-status-form';
import InternCompanyTradeUnionForm from '../intern-company-trade-union-form';
import InternGalleryForm from '../intern-gallery-form';
import InternCertificateForm from '../intern-certificate-form';
import InternPassForm from '../intern-pass-form';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function InternProfileView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { user } = useAuthContext();

  const TABS = [
    {
      value: 'profile',
      label: t('info_study'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'followers',
      label: t('info'),
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'friends',
      label: t('other_info'),
      icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
    },
    {
      value: 'gallery',
      label: t('point'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'attendance',
      label: t('attendance'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'image',
      label: t('gallery'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
  ];

  const TABS_SOURCE = [
    {
      value: 'profile',
      label: t('info_study'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'followers',
      label: t('info'),
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'gallery',
      label: t('point'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'attendance',
      label: t('attendance'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'image',
      label: t('gallery'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
  ];

  const TABSTRADEUNION = [
    {
      value: 'profile',
      label: t('info_study'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'followers',
      label: t('info'),
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'attendance',
      label: t('attendance'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'image',
      label: t('gallery'),
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
  ];

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
    const { data } = await axios(
      `${process.env.REACT_APP_HOST_API}/api/gallery/listByInternId?internId=${id}`
    );
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
          {/* eslint-disable-next-line no-nested-ternary */}
          {user?.role === 'tradeunion'
            ? TABSTRADEUNION.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))
            : user?.role === 'source'
            ? TABS_SOURCE.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))
            : TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome currentIntern={intern} info={_userAbout} posts={_userFeeds} />
      )}

      {currentTab === 'followers' && <InternViewForm currentIntern={intern} />}

      {currentTab === 'friends' && user?.role === 'admin' && (
        // <ProfileFriends
        //   friends={_userFriends}
        //   searchFriends={searchFriends}
        //   onSearchFriends={handleSearchFriends}
        // />
        <>
          <InternStatusForm
            internId={intern?._id}
            currentStatus={intern?.status}
            currentDepartureDate={intern?.departureDate}
            currentReturnDate={intern?.returnDate}
            currentType={intern?.type}
          />

          <InternCompanyTradeUnionForm currentIntern={intern} />

          <InternOtherForm currentIntern={intern} />

          <InternPassForm currentIntern={intern} />

          <InternGalleryForm currentIntern={intern} />

          <InternCertificateForm currentIntern={intern} />
        </>
      )}

      {currentTab === 'gallery' && (user?.role === 'admin' || user?.role === 'source') && (
        <InternPointForm internId={intern?._id} />
      )}

      {currentTab === 'attendance' &&
        (user?.role === 'admin' || user?.role === 'source' ? (
          <CalendarPage intern={intern} />
        ) : (
          <CalendarViewPage intern={intern} />
        ))}

      {currentTab === 'image' && (
        <ProfileGallery gallery={galleries} onRefresh={handleGetGalleryByInternId} />
      )}
    </Container>
  );
}
