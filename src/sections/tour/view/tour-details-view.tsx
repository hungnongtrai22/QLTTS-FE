import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
import { _tours, TOUR_PUBLISH_OPTIONS, TOUR_DETAILS_TABS } from 'src/_mock';
// components
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';

//
import TourDetailsToolbar from '../tour-details-toolbar';
import TourDetailsContent from '../tour-details-content';
import TourDetailsBookers from '../tour-details-bookers';

// ----------------------------------------------------------------------
interface Gallery {
  _id: string;
  title?: string;
  description?: string;
  postedAt?: Date;
  publish?: boolean | string; // tùy bạn dùng Boolean hay String trong schema
  internId?: any;
}

export default function TourDetailsView() {
  const settings = useSettingsContext();
  const [gallery, setGallery] = useState<Gallery | null>();

  const params = useParams();
  console.log("_tours", _tours)

  const { id } = params;

  // const currentTour = _tours.filter((tour) => tour.id === id)[0];

  const [publish, setPublish] = useState('publish');

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

   const handleGetGalleryById = useCallback(async () => {
      const { data } = await axios(`${process.env.REACT_APP_HOST_API}/api/gallery/${id}`);
      console.log(data.gallery);
      setGallery(data.gallery);
    }, [id]);
  
    useEffect(() => {
      handleGetGalleryById();
    }, [handleGetGalleryById]);

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? (
              <Label variant="filled">{12}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TourDetailsToolbar
        backLink={paths.dashboard.intern.profile(gallery?.internId?._id)}
        editLink={paths.dashboard.tour.edit(`${gallery?._id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={TOUR_PUBLISH_OPTIONS}
      />
      {/* {renderTabs} */}

      {currentTab === 'content' && gallery && <TourDetailsContent tour={gallery} />}

      {/* {currentTab === 'bookers' && <TourDetailsBookers bookers={gallery?.bookers} />} */}
    </Container>
  );
}
