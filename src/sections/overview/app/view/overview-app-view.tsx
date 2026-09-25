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
import { Box, Card } from '@mui/material';

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
import styles from './study-style.module.css';

// ----------------------------------------------------------------------
function getDaysOfCurrentMonthJP() {
  const today = new Date();
  const day = today.getDate(); // ngày hiện tại trong tháng

  return Array.from({ length: day }, (_, i) => `${i + 1}日`);
}

interface Total3Year {
  pass3Year2022: number;
  pass3Year2023: number;
  pass3Year2024: number;
  pass3Year2025: number;
  pass3Year2026: number;
  wait3Year: number;
  studyDN: number;
  studyTV: number;
  studyCT: number;
  studyHN: number;
  studyTraminco: number;
  studyIkigai: number;
  studyBCN: number;
  studyNTC: number;
  studyTG: number;
  studyDT: number;
  studyNT: number;
}

interface Total {
  pass: number;
  passCurrentYear: number;
  complete: number;
  soon: number;
  wait: number;
  study: number;
}

interface Total1Year {
  pass1Year2024: number;
  pass1Year2025: number;
  pass1Year2026: number;
  wait1Year: number;
  study1YearTV: number;
  study1YearCT: number;
  study1YearTraminco: number;
  study1YearNT: number;
}

interface TotalEngineer {
  passKS2025: number;
  passKS2026: number;
  waitKS: number;
  studyKS: number;
}

interface TotalTokuteiKS {
  passKS2025: number;
  waitKS: number;
  studyKS: number;
}

interface TotalTokutei {
  pass2023: number;
  pass2024: number;
  pass2025: number;
  pass2026: number;
  waitSkill: number;
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
  const [total3Year, setTotal3Year] = useState<Total3Year | null>(null);
  const [total, setTotal] = useState<Total | null>(null);
  const [total1Year, setTotal1Year] = useState<Total1Year | null>(null);
  const [totalEngineer, setTotalEngineer] = useState<TotalEngineer | null>(null);
  const [totalTokuteiKS, setTotalTokuteiKS] = useState<TotalTokuteiKS | null>(null);
  const [totalTokutei, setTotalTokutei] = useState<TotalTokutei | null>(null);

  const theme = useTheme();

  const settings = useSettingsContext();

  // Một lời gọi duy nhất thay cho 12 endpoint riêng lẻ.
  // Backend chạy 12 phép thống kê song song rồi cache 3 phút — xem
  // QLTTS-BE/src/pages/api/user/dashboardStats.ts
  const handleGetStats = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HOST_API}/api/user/dashboardStats`
      );

      setCount(data.count);
      setCountSource(data.countSource);
      setCountSourceByMonth(data.countByMonth);
      setCountSourceByWeek(data.countByWeek);
      setTopStudy(data.topStudy);
      setAvgSource(data.avgSource?.stats);
      setTotal3Year(data.total3Year);
      setTotal(data.total);
      setTotal1Year(data.total1Year);
      setTotalEngineer(data.totalEngineer);
      setTotalTokuteiKS(data.totalTokuteiKS);
      setTotalTokutei(data.totalTokutei);
    } catch (error) {
      console.error('[Dashboard stats]', error);
    }
  }, []);

  useEffect(() => {
    handleGetStats();
  }, [handleGetStats]);

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

        <Grid xs={12} md={12}>
          <Card sx={{ display: 'flex', p: 1.5 }}>
            <Box sx={{ p: 1, flex: 1 }}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={17} style={{ fontWeight: 'bold' }}>
                      Đơn hàng 3 năm
                    </td>
                    <td className={styles.td}>Xuất Cảnh 2022</td>
                    <td className={styles.td}>{total3Year?.pass3Year2022 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2023</td>
                    <td className={styles.td}>{total3Year?.pass3Year2023 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2024</td>
                    <td className={styles.td}>{total3Year?.pass3Year2024 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2025</td>
                    <td className={styles.td}>{total3Year?.pass3Year2025 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2026</td>
                    <td className={styles.td}>{total3Year?.pass3Year2026 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{total3Year?.wait3Year || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Đà Nẵng</td>
                    <td className={styles.td}>{total3Year?.studyDN || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Trà Vinh</td>
                    <td className={styles.td}>{total3Year?.studyTV || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Cần Thơ</td>
                    <td className={styles.td}>{total3Year?.studyCT || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Hà Nội</td>
                    <td className={styles.td}>{total3Year?.studyHN || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Traminco</td>
                    <td className={styles.td}>{total3Year?.studyTraminco || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Ikigai</td>
                    <td className={styles.td}>{total3Year?.studyIkigai || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở BCN</td>
                    <td className={styles.td}>{total3Year?.studyBCN || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở NTC</td>
                    <td className={styles.td}>{total3Year?.studyNTC || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Tiền Giang (Anh Nhân)</td>
                    <td className={styles.td}>{total3Year?.studyTG || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở TTVL Đồng Tháp</td>
                    <td className={styles.td}>{total3Year?.studyDT || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học tại Trung Tâm TX01</td>
                    <td className={styles.td}>{total3Year?.studyNT || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {total3Year ? Object.values(total3Year).reduce((s, n) => s + n, 0) : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
              <table className={styles.table} style={{ marginTop: '15px' }}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={6} style={{ fontWeight: 'bold' }}>
                      Tất Cả
                    </td>
                    <td className={styles.td}>Đã Xuất Cảnh</td>
                    <td className={styles.td}>{total?.pass || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất cảnh {new Date().getFullYear()}</td>
                    <td className={styles.td}>{total?.passCurrentYear || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Hoàn thành hợp đồng</td>
                    <td className={styles.td}>{total?.complete || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Về nước trước hạn</td>
                    <td className={styles.td}>{total?.soon || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{total?.wait || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học</td>
                    <td className={styles.td}>{total?.study || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {total ? Object.values(total).reduce((s, n) => s + n, 0) : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Box sx={{ p: 1, flex: 1 }}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={8} style={{ fontWeight: 'bold' }}>
                      Đơn hàng 1 năm
                    </td>
                    <td className={styles.td}>Xuất Cảnh 2024</td>
                    <td className={styles.td}>{total1Year?.pass1Year2024 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2025</td>
                    <td className={styles.td}>{total1Year?.pass1Year2025 || 0}</td>
                  </tr>
                    <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2026</td>
                    <td className={styles.td}>{total1Year?.pass1Year2026 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{total1Year?.wait1Year || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Trà Vinh</td>
                    <td className={styles.td}>{total1Year?.study1YearTV || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Cần Thơ</td>
                    <td className={styles.td}>{total1Year?.study1YearCT || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Traminco</td>
                    <td className={styles.td}>{total1Year?.study1YearTraminco || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở TX01</td>
                    <td className={styles.td}>{total1Year?.study1YearNT || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {total1Year ? Object.values(total1Year).reduce((s, n) => s + n, 0) : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
              <table className={styles.table} style={{ marginTop: '15px' }}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={4} style={{ fontWeight: 'bold' }}>
                      Kỹ sư
                    </td>
                    <td className={styles.td}>Xuất Cảnh 2025</td>
                    <td className={styles.td}>{totalEngineer?.passKS2025 || 0}</td>
                  </tr>
                      <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2026</td>
                    <td className={styles.td}>{totalEngineer?.passKS2026 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{totalEngineer?.waitKS || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Trung Tâm TX01</td>
                    <td className={styles.td}>{totalEngineer?.studyKS || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {totalEngineer ? Object.values(totalEngineer).reduce((s, n) => s + n, 0) : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
              <table className={styles.table} style={{ marginTop: '15px' }}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={3} style={{ fontWeight: 'bold' }}>
                      Tokutei KS
                    </td>
                    <td className={styles.td}>Xuất Cảnh 2025</td>
                    <td className={styles.td}>{totalTokuteiKS?.passKS2025 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{totalTokuteiKS?.waitKS || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Đang học ở Trung Tâm TX01</td>
                    <td className={styles.td}>{totalTokuteiKS?.studyKS || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {totalTokuteiKS
                        ? Object.values(totalTokuteiKS).reduce((s, n) => s + n, 0)
                        : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
              <table className={styles.table} style={{ marginTop: '15px' }}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2}>
                      Nội dung
                    </th>
                    <th className={styles.th}>Số lượng</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr className={styles.tr}>
                    <td className={styles.td} rowSpan={5} style={{ fontWeight: 'bold' }}>
                      Đặc định
                    </td>
                    <td className={styles.td}>Xuất Cảnh 2023</td>
                    <td className={styles.td}>{totalTokutei?.pass2023 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2024</td>
                    <td className={styles.td}>{totalTokutei?.pass2024 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2025</td>
                    <td className={styles.td}>{totalTokutei?.pass2025 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Xuất Cảnh 2026</td>
                    <td className={styles.td}>{totalTokutei?.pass2026 || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <td className={styles.td}>Chờ bay</td>
                    <td className={styles.td}>{totalTokutei?.waitSkill || 0}</td>
                  </tr>
                  <tr className={styles.tr}>
                    <th className={styles.th} colSpan={2} style={{ backgroundColor: '#A6E3E9' }}>
                      Tổng cộng
                    </th>
                    <th className={styles.th} style={{ backgroundColor: '#A6E3E9' }}>
                      {totalTokutei ? Object.values(totalTokutei).reduce((s, n) => s + n, 0) : 0}
                    </th>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Card>
          {/* <Card sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
             
          </Card> */}
        </Grid>

        {/* <Grid xs={12} md={4}>
          <div></div>
        </Grid>

        <Grid xs={12} md={4}>
        <div></div>
        </Grid> */}

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
                  {
                    type: 'Tháng',
                    categories: getDaysOfCurrentMonthJP(),
                    data: [
                      {
                        name: 'Đang Học',
                        data: (countSourceByMonth as any)?.study?.chart?.series.slice(
                          0,
                          new Date().getDate()
                        ),
                      },
                      {
                        name: 'Đã Xuất Cảnh',
                        data: (countSourceByMonth as any)?.pass?.chart?.series.slice(
                          0,
                          new Date().getDate()
                        ),
                      },
                      {
                        name: 'Hoàn thành Hoặc Về Sớm',
                        data: (countSourceByMonth as any)?.completeOrSoon?.chart?.series.slice(
                          0,
                          new Date().getDate()
                        ),
                      },
                    ],
                  },
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
                      {
                        name: 'Đã Xuất Cảnh',
                        data: (countSourceByWeek as any)?.study?.chart?.series,
                      },
                      {
                        name: 'Hoàn thành Hoặc Về Sớm',
                        data: (countSourceByWeek as any)?.study?.chart?.series,
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
            title={`Điểm trung bình từng nguồn ${
              new Date().getMonth() === 0 ? 12 : new Date().getMonth()
            }`}
            // subheader="(+43%) than last year"
            chart={{
              series:
                avgSource?.map((item: any) => ({
                  label: item?.sourceName,
                  value: item?.averageScore?.toFixed(0),
                })) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors
            title={`Bảng xếp hạng thực tập sinh tháng ${
              new Date().getMonth() === 0 ? 12 : new Date().getMonth()
            }`}
            list={topStudy}
          />
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
