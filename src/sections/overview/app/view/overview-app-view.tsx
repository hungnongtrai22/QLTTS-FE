import { useCallback, useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
import { useAuthContext } from 'src/auth/hooks';
import { t } from 'i18next';
import axios from 'axios';

//
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  // const { user } = useMockedUser();
  const { user } = useAuthContext();

  const [count, setCount] = useState();
  const [countSource, setCountSource] = useState();

  const theme = useTheme();

  const settings = useSettingsContext();

  const handleGetAllIntern = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/count`);
    // console.log(data.interns);
    setCount(data);
  }, []);

  const handleGetAllCountSource = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/countSource`);
    // console.log(data.interns);
    setCountSource(data);
  }, []);

  useEffect(() => {
    handleGetAllIntern();
    handleGetAllCountSource();
  }, [handleGetAllIntern, handleGetAllCountSource]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`${t('welcome_back')} 👋 \n ${user?.name}`}
            description={t('content') || ''}
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                {t('go_now')}
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Thực Tập Sinh Đang Học"
            percent={2.6}
            total={(count as any)?.study?.total || 0}
            chart={{
              series: (count as any)?.study?.chart?.series || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Thực Tập Sinh Đã Xuất Cảnh"
            percent={0.2}
            total={(count as any)?.pass?.total || 0}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: (count as any)?.pass?.chart?.series || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Thực Tập Sinh Hoàn Thành Hoặc Về Sớm"
            percent={-0.1}
            total={(count as any)?.completeOrSoon?.total || 0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: (count as any)?.completeOrSoon?.chart?.series || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Thực Tập Sinh Đang Học"
            chart={{
              // series: [
              //   { label: 'Mac', value: 12244 },
              //   { label: 'Window', value: 53345 },
              //   { label: 'iOS', value: 44313 },
              //   { label: 'Android', value: 78343 },
              // ],
              series: (countSource as any)?.map((item: any) => ({
                label: item.sourceName,
                value: item.count,
              })) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
