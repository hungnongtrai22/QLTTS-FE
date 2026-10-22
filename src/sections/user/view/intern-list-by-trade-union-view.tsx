import isEqual from 'lodash/isEqual';
import { m } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
// types
import { IInternTableFilters, IUserTableFilterValue } from 'src/types/user';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { MotionContainer, varFade } from 'src/components/animate';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';

//
import InternTableFiltersResult from '../intern-table-filters-result';
import InternByTradeUnionTableToolbar from '../intern-by-trade-union-table-toolbar';
import InternTradeUnionStudyRow from '../intern-trade-union-study-row';
import InternTradeUnionStudyCard from '../intern-trade-union-study-card';
import usePartnerStudyLabels from '../use-partner-study-labels';
import PartnerStudyExportDialog from '../partner-study-export-dialog';
import {
  PartnerInternRow,
  PartnerStudyResponse,
  buildPartnerRows,
  splitMonth,
} from '../partner-study-utils';

// ----------------------------------------------------------------------
// Danh sách TTS của nghiệp đoàn (trang đối tác vào đầu tiên). Ngoài hồ sơ, mỗi dòng có tình hình
// học tập từ báo cáo ĐÃ CÔNG KHAI: tổng điểm tháng mới nhất (so với lần trước), bài đang học, dự
// kiến bài lúc sang Nhật — xem partner-study-utils.ts. Điện thoại / tablet: dạng thẻ.
// ----------------------------------------------------------------------

type StudyFlag = '' | 'new' | 'behind';

type PartnerFilters = IInternTableFilters & { studyFlag: StudyFlag };

const defaultFilters: PartnerFilters = {
  name: '',
  tradeUnion: [],
  status: 'all',
  company: [],
  studyFlag: '',
};

const fadeInUp = varFade({ distance: 24 }).inUp;

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

function HeadLabel({ title, sub }: { title: string; sub: string }) {
  return (
    <Stack component="span" spacing={0.25}>
      <span>{title}</span>
      <Typography component="span" variant="caption" sx={{ fontWeight: 400 }}>
        {sub}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export default function InternListByTradeUnionView() {
  const table = useTable();

  const { onResetPage, onSelectRow } = table;

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const confirm = useBoolean();

  const exportDialog = useBoolean();

  const { t, scoreHeader } = usePartnerStudyLabels();

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'study', label: t('studying') },
    { value: 'pass', label: t('pass') },
    { value: 'complete', label: t('complete') },
    { value: 'soon', label: t('soon') },
    { value: 'wait', label: t('wait') },
  ];

  const [tableData, setTableData] = useState<any[]>([]);
  const [studyData, setStudyData] = useState<PartnerStudyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState<PartnerFilters>(defaultFilters);

  const currentMonth = studyData?.month ?? null;

  const rows = useMemo(() => buildPartnerRows(tableData, studyData), [tableData, studyData]);

  // Số trên hai nút lọc nhanh: trong tab trạng thái đang chọn.
  const flagCounts = useMemo(() => {
    const inStatus =
      filters.status === 'all' ? rows : rows.filter((row) => row.status === filters.status);
    return {
      new: inStatus.filter((row) => row.study.isNew).length,
      behind: inStatus.filter((row) => row.study.forecast === 'behind').length,
    };
  }, [rows, filters.status]);

  // Bọc useMemo: applyFilter sao chép rồi sắp xếp toàn bộ mảng và lọc tuần tự.
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: rows,
        comparator: getComparator(table.order, table.orderBy),
        filters,
      }),
    [rows, table.order, table.orderBy, filters]
  );

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const scoreLabel = scoreHeader(currentMonth);

  const TABLE_HEAD = [
    { id: 'name', label: t('name'), minWidth: 220 },
    { id: 'companyName', label: t('company_name'), minWidth: 140 },
    {
      id: 'studyTotal',
      label: <HeadLabel title={scoreLabel} sub={t('partner_col_score_sub')} />,
      minWidth: 160,
    },
    {
      id: 'studyLesson',
      label: <HeadLabel title={t('partner_col_progress')} sub={t('partner_col_progress_sub')} />,
      minWidth: 210,
    },
    {
      id: 'startDate',
      label: <HeadLabel title={t('date_import')} sub={t('partner_col_forecast_sub')} />,
      minWidth: 170,
    },
    { id: '', width: 56 },
  ];

  // "Báo cáo mới nhất: tháng 9/2026 (cập nhật 6/10)"
  const latestLine = useMemo(() => {
    const latest = splitMonth(currentMonth);
    if (!latest) return '';
    const updated = studyData?.updatedAt
      ? new Date(new Date(studyData.updatedAt).getTime() + VN_OFFSET_MS)
      : null;
    return t('partner_latest_report', {
      year: latest.year,
      month: latest.month,
      date: updated
        ? t('partner_date', { month: updated.getUTCMonth() + 1, day: updated.getUTCDate() })
        : '—',
    });
  }, [currentMonth, studyData, t]);

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [onResetPage]
  );

  const handleToggleFlag = useCallback(
    (flag: StudyFlag) => {
      onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        studyFlag: prevState.studyFlag === flag ? '' : flag,
      }));
    },
    [onResetPage]
  );

  const handleAddInternIntoCompare = useCallback(async () => {
    const listIntern = table.selected;
    await axios.put(`${process.env.REACT_APP_HOST_API}/api/compare/updateListIntern`, {
      accountId: user?._id,
      listIntern,
    });
    enqueueSnackbar(t('text_compare'));
  }, [table, enqueueSnackbar, user, t]);

  const handleViewRow = useCallback((id: string) => {
    const url = paths.dashboard.intern.profile(id);
    window.open(url, '_blank');
  }, []);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleGetAllIntern = useCallback(async () => {
    setLoading(true);
    try {
      // BE tự giới hạn theo nghiệp đoàn (và công ty được xem) của tài khoản đang đăng nhập.
      const url =
        user?.companySelect && user?.companySelect?.length > 0
          ? 'user/listByTradeUnionAndCompany'
          : 'user/listByTradeUnion';
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/${url}`, {
        tradeUnion: user?.tradeUnion,
        companySelect: user?.companySelect,
      });
      setTableData(data.interns);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('partner_load_failed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, enqueueSnackbar, t]);

  const handleGetStudySummary = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/study/listPartnerSummary`,
        {}
      );
      setStudyData(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('partner_study_failed'), { variant: 'error' });
    }
  }, [enqueueSnackbar, t]);

  const handleGetCompany = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/company/listByTradeUnionAndCompany`,
      {
        tradeUnion: user?.tradeUnion,
        companySelect: user?.companySelect,
      }
    );

    setCompany(data.companies.map((item: any) => item.name));
  }, [user]);

  useEffect(() => {
    handleGetAllIntern();
    handleGetStudySummary();
    handleGetCompany();
  }, [handleGetAllIntern, handleGetStudySummary, handleGetCompany]);

  const renderFlag = (flag: Exclude<StudyFlag, ''>, color: 'info' | 'warning', count: number) => {
    const active = filters.studyFlag === flag;
    return (
      <Button
        variant={active ? 'contained' : 'soft'}
        color={color}
        aria-pressed={active}
        onClick={() => handleToggleFlag(flag)}
        sx={{ minHeight: 44, borderRadius: 5, px: 2 }}
      >
        {flag === 'new' ? t('partner_filter_new') : t('partner_filter_behind')}
        <Label variant="filled" color={active ? 'default' : color} sx={{ ml: 1 }}>
          {count}
        </Label>
      </Button>
    );
  };

  const renderCards = (
    <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.neutral' }}>
      {table.selected.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ px: 2, py: 1, borderRadius: 1.5, bgcolor: 'primary.lighter' }}
        >
          <Typography variant="subtitle2" sx={{ color: 'primary.darker' }}>
            {t('partner_selected', { count: table.selected.length })}
          </Typography>
          <Button variant="contained" onClick={confirm.onTrue} sx={{ minHeight: 44 }}>
            {t('partner_add_compare')}
          </Button>
        </Stack>
      )}

      {loading &&
        [...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rounded" sx={{ height: 180, borderRadius: 2 }} />
        ))}

      {!loading &&
        dataInPage.map((row) => (
          <InternTradeUnionStudyCard
            key={row._id}
            row={row}
            currentMonth={currentMonth}
            scoreLabel={scoreLabel}
            selected={table.selected.includes(row._id)}
            onSelectRow={onSelectRow}
            onViewRow={handleViewRow}
          />
        ))}

      {!loading && !dataFiltered.length && (
        <EmptyContent filled title={t('partner_empty') || ''} sx={{ py: 8 }} />
      )}
    </Stack>
  );

  const renderTable = (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <TableSelectedAction
        dense={table.dense}
        numSelected={table.selected.length}
        rowCount={tableData.length}
        onSelectAllRows={(checked) =>
          table.onSelectAllRows(
            checked,
            tableData.map((row) => row._id)
          )
        }
        action={
          <Tooltip title={t('partner_add_compare')}>
            <IconButton color="primary" onClick={confirm.onTrue}>
              <Iconify icon="streamline-ultimate:ranking-people-first-bold" />
            </IconButton>
          </Tooltip>
        }
      />

      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={tableData.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row._id)
              )
            }
          />

          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => <TableSkeleton key={index} />)
              : dataInPage.map((row) => (
                  <InternTradeUnionStudyRow
                    key={row._id}
                    row={row}
                    currentMonth={currentMonth}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={onSelectRow}
                    onViewRow={handleViewRow}
                  />
                ))}

            {!loading && (
              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />
            )}

            {!loading && <TableNoData notFound={notFound} />}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <MotionContainer>
          <Stack spacing={3}>
            <m.div variants={fadeInUp}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h4">{t('intern_by_trade_union')}</Typography>
                  {latestLine && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {latestLine}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {renderFlag('new', 'info', flagCounts.new)}
                  {renderFlag('behind', 'warning', flagCounts.behind)}
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
                    onClick={exportDialog.onTrue}
                    disabled={!studyData?.months?.length}
                    sx={{ minHeight: 44, borderRadius: 5, px: 2 }}
                  >
                    {t('partner_export_button')}
                  </Button>
                </Stack>
              </Stack>
            </m.div>

            <m.div variants={fadeInUp}>
              <Card>
                <Tabs
                  value={filters.status}
                  onChange={handleFilterStatus}
                  variant="scrollable"
                  allowScrollButtonsMobile
                  sx={{
                    px: 2.5,
                    boxShadow: (theme) =>
                      `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                  }}
                >
                  {STATUS_OPTIONS.map((tab) => (
                    <Tab
                      key={tab.value}
                      iconPosition="end"
                      value={tab.value}
                      label={tab.label}
                      icon={
                        <Label
                          variant={
                            ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                            'soft'
                          }
                          color={
                            (tab.value === 'study' && 'success') ||
                            (tab.value === 'pass' && 'warning') ||
                            (tab.value === 'complete' && 'error') ||
                            (tab.value === 'soon' && 'info') ||
                            'default'
                          }
                        >
                          {tab.value === 'all'
                            ? tableData.length
                            : tableData.filter((intern) => intern.status === tab.value).length}
                        </Label>
                      }
                    />
                  ))}
                </Tabs>

                <InternByTradeUnionTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  roleOptions={[]}
                  companyOptions={company}
                  interns={dataFiltered}
                />

                {canReset && (
                  <InternTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    //
                    onResetFilters={handleResetFilters}
                    //
                    results={dataFiltered.length}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}

                {mdUp ? renderTable : renderCards}

                <TablePaginationCustom
                  count={dataFiltered.length}
                  page={table.page}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                  //
                  dense={table.dense}
                  onChangeDense={mdUp ? table.onChangeDense : undefined}
                />
              </Card>
            </m.div>
          </Stack>
        </MotionContainer>
      </Container>

      {/* Chỉ dựng khi mở: hộp thoại tự giữ tháng / định dạng, mở lại là về mặc định. */}
      {exportDialog.value && (
        <PartnerStudyExportDialog
          onClose={exportDialog.onFalse}
          months={studyData?.months || []}
          companies={filters.company || []}
        />
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('title_compare')}
        content={
          <>
            {t('text1')} <strong> {table.selected.length} </strong> {t('text2')}
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleAddInternIntoCompare();
              confirm.onFalse();
            }}
          >
            {t('confirm')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD') // Tách dấu
    .replace(/[̀-ͯ]/g, '') // Xóa các dấu
    .replace(/đ/g, 'd') // Đ -> d
    .replace(/Đ/g, 'd') // Đ -> d
    .toLowerCase(); // Chuyển về chữ thường
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: PartnerInternRow[];
  comparator: (a: any, b: any) => number;
  filters: PartnerFilters;
}) {
  const { name, tradeUnion, company, status, studyFlag } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    // Tên tiếng Việt (bỏ dấu) hoặc tên katakana — đối tác người Nhật thường gõ katakana.
    const search = removeVietnameseTones(name);
    const kana = name.trim();
    inputData = inputData.filter(
      (user) =>
        removeVietnameseTones(user.name || '').includes(search) ||
        (!!kana && (user.namejp || '').includes(kana))
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (tradeUnion.length) {
    inputData = inputData.filter((user) => tradeUnion.includes(user?.tradeUnion?.name));
  }

  if (company?.length) {
    inputData = inputData.filter((user) => company.includes(user?.companySelect?.name));
  }

  if (studyFlag === 'new') {
    inputData = inputData.filter((user) => user.study.isNew);
  }

  if (studyFlag === 'behind') {
    inputData = inputData.filter((user) => user.study.forecast === 'behind');
  }

  return inputData;
}
