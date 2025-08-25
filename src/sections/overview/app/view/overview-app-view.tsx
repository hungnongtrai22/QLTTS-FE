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
import BankingBalanceStatistics from '../../banking/banking-balance-statistics';
import AnalyticsConversionRates from '../../analytics/analytics-conversion-rates';

// ----------------------------------------------------------------------
function getDaysOfCurrentMonthJP() {
  const today = new Date();
  const day = today.getDate(); // ngày hiện tại trong tháng

  return Array.from({ length: day }, (_, i) => `${i + 1}日`);
}

export default function OverviewAppView() {
  // const { user } = useMockedUser();
  const { user } = useAuthContext();

  const [count, setCount] = useState();
  const [countSource, setCountSource] = useState();
  const [countSourceByMonth, setCountSourceByMonth] = useState();
  const [countSourceByWeek, setCountSourceByWeek] = useState();
    const [topStudy, setTopStudy] = useState();
    const [avgSource, setAvgSource] = useState([]);


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

  const handleGetAllCountSourceByMonth = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/countByMonth`);
    // console.log(data.interns);
    setCountSourceByMonth(data);
  }, []);

  const handleGetAllCountSourceByWeek = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/countByWeek`);
    // console.log(data.interns);
    setCountSourceByWeek(data);
  }, []);

  const handleGetTopStudy = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/topStudy`);
    // console.log(data);
    setTopStudy(data);
  }, []);

    const handleGetAvgSource = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/avgSource`);
    console.log(data?.stats);
    setAvgSource(data?.stats);
  }, []);

  useEffect(() => {
    handleGetAllIntern();
    handleGetAllCountSource();
    handleGetAllCountSourceByMonth();
    handleGetAllCountSourceByWeek();
    handleGetTopStudy();
    handleGetAvgSource();
  }, [
    handleGetAllIntern,
    handleGetAllCountSource,
    handleGetAllCountSourceByMonth,
    handleGetAllCountSourceByWeek,
    handleGetTopStudy,
    handleGetAvgSource
  ]);

  // console.log((countSourceByMonth as any)?.study?.chart?.series);

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
              series:
                (countSource as any)?.map((item: any) => ({
                  label: item.sourceName,
                  value: item.count,
                })) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <BankingBalanceStatistics
              title="Danh Sách Thực Tập Sinh"
              // subheader="(+43% Income | +12% Expense) than last year"
              chart={{
                series: [
                  {
                    type: 'Tuần',
                    categories: [
                      '月曜日',
                      '火曜日',
                      '水曜日',
                      '木曜日',
                      '金曜日',
                      '土曜日',
                      '日曜日',
                    ],
                    data: [
                      { name: 'Đang Học', data: (countSourceByWeek as any)?.study?.chart?.series },
                      { name: 'Đã Xuất Cảnh', data: (countSourceByWeek as any)?.study?.chart?.series },
                      { name: 'Hoàn thành Hoặc Về Sớmh', data: (countSourceByWeek as any)?.study?.chart?.series },
                    ],
                  },
                  {
                    type: 'Tháng',
                    categories: getDaysOfCurrentMonthJP(),
                    data: [
                      {
                        name: 'Đang Học',
                        data: (countSourceByMonth as any)?.study?.chart?.series.slice(0,new Date().getDate())
                      },
                      {
                        name: 'Đã Xuất Cảnh',
                        data: (countSourceByMonth as any)?.pass?.chart?.series.slice(0,new Date().getDate()),
                      },
                      {
                        name: 'Hoàn thành Hoặc Về Sớm',
                        data: (countSourceByMonth as any)?.completeOrSoon?.chart?.series.slice(0,new Date().getDate()),
                      },
                    ],
                  },
                  {
                    type: 'Năm',
                    categories: [
                      '1月',
                      '2月',
                      '3月',
                      '4月',
                      '5月',
                      '6月',
                      '7月',
                      '8月',
                      '9月',
                      '10月',
                      '11月',
                      '12月',
                    ],
                    data: [
                      { name: 'Đang Học', data: (count as any)?.study?.chart?.series },
                      { name: 'Đã Xuất Cảnh', data: (count as any)?.pass?.chart?.series },
                      {
                        name: 'Hoàn thành Hoặc Về Sớm',
                        data: (count as any)?.completeOrSoon?.chart?.series,
                      },
                    ],
                  },
                ],
              }}
            />
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
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
        </Grid> */}

        {/* <Grid xs={12} lg={8}>
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
        </Grid> */}

         <Grid xs={12} md={6} lg={8}>
                  <AnalyticsConversionRates
                    title={`Điểm trung bình từng nguồn ${new Date().getMonth()}`}
                    // subheader="(+43%) than last year"
                    chart={{
                      // series: [
                      //   { label: 'Italy', value: 400 },
                      //   { label: 'Japan', value: 430 },
                      //   { label: 'China', value: 448 },
                      //   { label: 'Canada', value: 470 },
                      //   { label: 'France', value: 540 },
                      //   { label: 'Germany', value: 580 },
                      //   { label: 'South Korea', value: 690 },
                      //   { label: 'Netherlands', value: 1100 },
                      //   { label: 'United States', value: 1200 },
                      //   { label: 'United Kingdom', value: 1380 },
                      // ],
                        series: avgSource?.map((item : any)=> ({ label: item?.sourceName, value: item?.averageScore?.toFixed(0) })) || [],
                    }}
                  />
                </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title={`Bảng xếp hạng thực tập sinh tháng ${new Date().getMonth()}`} list={topStudy} />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title={`Bảng xếp hạng thực tập sinh tháng ${new Date().getMonth()}`} list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
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
        </Grid> */}
      </Grid>
    </Container>
  );
}
