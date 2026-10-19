import { useCallback, useEffect, useMemo, useState } from 'react';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
// _mock
import { _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import { MotionViewport, varFade } from 'src/components/animate';
import axios from 'axios';
import { Box } from '@mui/material';

//
import AppWidget from '../app-widget';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import AppOverallStats from '../app-overall-stats';
import AppProgramStats, { StatItem } from '../app-program-stats';
import BankingBalanceStatistics from '../../banking/banking-balance-statistics';
import AnalyticsConversionRates from '../../analytics/analytics-conversion-rates';

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

// Cơ sở đào tạo của từng chương trình: [tên hiển thị, trường trong số liệu BE].
// Tên địa danh giữ nguyên ở mọi ngôn ngữ; riêng "Trung tâm TX01" có bản dịch (thêm ở dưới).
const CENTERS_3YEAR: [string, keyof Total3Year][] = [
  ['Trà Vinh', 'studyTV'],
  ['Cần Thơ', 'studyCT'],
  ['Traminco', 'studyTraminco'],
  ['Ikigai', 'studyIkigai'],
  ['BCN', 'studyBCN'],
  ['NTC', 'studyNTC'],
  ['Tiền Giang (Anh Nhân)', 'studyTG'],
  ['TTVL Đồng Tháp', 'studyDT'],
  ['Đà Nẵng', 'studyDN'],
  ['Hà Nội', 'studyHN'],
];

const CENTERS_1YEAR: [string, keyof Total1Year][] = [
  ['Trà Vinh', 'study1YearTV'],
  ['Cần Thơ', 'study1YearCT'],
  ['Traminco', 'study1YearTraminco'],
];

function toItems<T>(data: T | null, fields: [string, keyof T][]): StatItem[] {
  return fields.map(([label, key]) => ({ label, value: Number(data?.[key]) || 0 }));
}

export default function OverviewAppView() {
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

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

  const settings = useSettingsContext();

  // Một lời gọi duy nhất thay cho 12 endpoint riêng lẻ.
  // Backend chạy 12 phép thống kê song song rồi cache 3 phút — xem
  // QLTTS-BE/src/pages/api/user/dashboardStats.ts
  const handleGetStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/dashboardStats`);

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
      enqueueSnackbar(t('dashboard_load_failed'), { variant: 'error' });
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    handleGetStats();
  }, [handleGetStats]);

  // Dữ liệu cho các thẻ chương trình (thay cho 6 bảng HTML kẻ ô trước đây).
  const programs = useMemo(() => {
    const tx01 = t('dashboard_center_tx01');
    return [
      {
        key: '3year',
        title: t('dashboard_program_3year'),
        icon: 'solar:users-group-rounded-bold-duotone',
        wide: true,
        loading: !total3Year,
        departures: toItems(total3Year, [
          ['2022', 'pass3Year2022'],
          ['2023', 'pass3Year2023'],
          ['2024', 'pass3Year2024'],
          ['2025', 'pass3Year2025'],
          ['2026', 'pass3Year2026'],
        ]),
        waiting: total3Year?.wait3Year || 0,
        studying: [
          { label: tx01, value: total3Year?.studyNT || 0 },
          ...toItems(total3Year, CENTERS_3YEAR),
        ],
      },
      {
        key: '1year',
        title: t('dashboard_program_1year'),
        icon: 'solar:calendar-mark-bold-duotone',
        loading: !total1Year,
        departures: toItems(total1Year, [
          ['2024', 'pass1Year2024'],
          ['2025', 'pass1Year2025'],
          ['2026', 'pass1Year2026'],
        ]),
        waiting: total1Year?.wait1Year || 0,
        studying: [
          { label: tx01, value: total1Year?.study1YearNT || 0 },
          ...toItems(total1Year, CENTERS_1YEAR),
        ],
      },
      {
        key: 'engineer',
        title: t('dashboard_program_engineer'),
        icon: 'solar:case-round-bold-duotone',
        loading: !totalEngineer,
        departures: toItems(totalEngineer, [
          ['2025', 'passKS2025'],
          ['2026', 'passKS2026'],
        ]),
        waiting: totalEngineer?.waitKS || 0,
        studying: [{ label: tx01, value: totalEngineer?.studyKS || 0 }],
      },
      {
        key: 'tokuteiKS',
        title: t('dashboard_program_tokutei_ks'),
        icon: 'solar:diploma-verified-bold-duotone',
        loading: !totalTokuteiKS,
        departures: toItems(totalTokuteiKS, [['2025', 'passKS2025']]),
        waiting: totalTokuteiKS?.waitKS || 0,
        studying: [{ label: tx01, value: totalTokuteiKS?.studyKS || 0 }],
      },
      {
        key: 'tokutei',
        title: t('dashboard_program_tokutei'),
        icon: 'solar:square-academic-cap-bold-duotone',
        loading: !totalTokutei,
        departures: toItems(totalTokutei, [
          ['2023', 'pass2023'],
          ['2024', 'pass2024'],
          ['2025', 'pass2025'],
          ['2026', 'pass2026'],
        ]),
        waiting: totalTokutei?.waitSkill || 0,
        studying: [],
      },
    ];
  }, [t, total3Year, total1Year, totalEngineer, totalTokuteiKS, totalTokutei]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* Khung chào mừng, khung tin tức và 3 thẻ "Đang học / Đã xuất cảnh / Hoàn thành hoặc về
            sớm" đã gỡ theo yêu cầu chủ dự án — số liệu đó đã có ở phần thống kê ngay dưới. */}

        {/* Số liệu theo trạng thái và theo chương trình. Lưới: thẻ 3 năm rộng 8/12 cạnh thẻ
            1 năm trên màn hình lớn; từ tablet các thẻ nhỏ 2 thẻ/hàng; điện thoại 1 thẻ/hàng. */}
        <Grid xs={12}>
          <Box component={MotionViewport}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <m.div variants={varFade({ distance: 24 }).inUp}>
                  <AppOverallStats data={total} />
                </m.div>
              </Grid>

              {programs.map(({ key, ...program }) => (
                <Grid key={key} xs={12} sm={program.wide ? 12 : 6} lg={program.wide ? 8 : 4}>
                  <Box
                    component={m.div}
                    variants={varFade({ distance: 24 }).inUp}
                    sx={{ height: 1 }}
                  >
                    <AppProgramStats {...program} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* <Grid xs={12} md={4}>
          <div></div>
        </Grid>

        <Grid xs={12} md={4}>
        <div></div>
        </Grid> */}

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
