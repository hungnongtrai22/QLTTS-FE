import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
import { useLocales } from 'src/locales';
// types
import { IInternItem, IUserTableFilterValue } from 'src/types/user';
// _mock
import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Stack, TextField } from '@mui/material';

import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';

//
import InternTableRow from '../intern-table-row';
import InternTableToolbar from '../intern-table-toolbar';
import InternTableFiltersResult from '../intern-table-filters-result';
import InternTableToolbarWithSource from '../intern-table-toolbar-with-source';
import InternContractButton from '../intern-contract-button';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'Tất cả' }, ...USER_STATUS_OPTIONS];

const defaultFilters = {
  name: '',
  // role: [],
  tradeUnion: [],
  source: [],
  company: [],
  status: 'all',
  type: [],
  year: [],
};

interface Order {
  value: string;
  text: string;
}

// ----------------------------------------------------------------------

export default function InternListView() {
  const { t } = useLocales();

  const { user: userRole } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'name', label: t('full_name'), width: 310 },
    { id: 'phoneNumber', label: t('city'), width: 100 },
    { id: 'birthday', label: t('birthday'), width: 120 },
    { id: 'age', label: t('age'), width: 80 },

    { id: 'height', label: t('height'), width: 100 },
    { id: 'weight', label: t('weight'), width: 100 },
    { id: 'createdAt', label: t('create_date'), width: 120 },
    // { id: 'createDate', label: t('create_date'), width: 120 },
    { id: '', width: 88 },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'interview', label: t('interview') },
    { value: 'study', label: t('studying') },
    { value: 'pass', label: t('pass') },
    { value: 'complete', label: t('complete') },
    { value: 'soon', label: t('soon') },
    { value: 'wait', label: t('wait') },
  ];

  const table = useTable();

  // Tách sẵn phương thức cần dùng: tham chiếu ổn định, và eslint không đòi
  // cả object `table` trong mảng phụ thuộc (object đó đổi mỗi khi selection đổi).
  const { onResetPage, onUpdatePageDeleteRow } = table;

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IInternItem[]>([]);
  const [tradeUnion, setTradeUnion] = useState([]);
  const [source, setSource] = useState([]);
  const [company, setCompany] = useState([]);
  const [orderSelect, setOrderSelect] = useState<Order | null>(null);
  const [orders, setOrders] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  // Việc lọc, sắp xếp và phân trang nay do server làm. `tableData` chỉ chứa trang hiện tại.
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Ô tìm kiếm gõ tới đâu gọi API tới đó thì quá tốn; hoãn lại 400ms.
  const [debouncedName, setDebouncedName] = useState('');

  // Tăng số này để buộc tải lại danh sách (sau khi xoá). Dùng token thay vì gọi thẳng
  // hàm fetch để không phải phụ thuộc vào hàm được khai báo phía dưới.
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((value) => value + 1), []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedName(filters.name), 400);
    return () => clearTimeout(timer);
  }, [filters.name]);

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !tableData.length && !loading;

  // Tham số truy vấn dùng chung cho cả bảng lẫn các thao tác hàng loạt.
  const filterParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (debouncedName) params.search = debouncedName;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.tradeUnion?.length) params.tradeUnion = filters.tradeUnion.join(',');
    if (filters.source?.length) params.source = filters.source.join(',');
    if (filters.company?.length) params.company = filters.company.join(',');
    if (filters.type?.length) params.type = filters.type.join(',');
    if (filters.year?.length) params.year = filters.year.join(',');

    return params;
    // Cố ý KHÔNG phụ thuộc cả object `filters`, và cố ý bỏ `filters.name`:
    // name đổi ở mỗi phím gõ, nếu đưa vào đây thì mỗi ký tự sẽ sinh một object
    // filterParams mới -> handleGetAllIntern đổi -> gọi lại API với giá trị tìm
    // kiếm CŨ. Giá trị tìm kiếm đã được thay bằng debouncedName ở trên.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedName,
    filters.status,
    filters.tradeUnion,
    filters.source,
    filters.company,
    filters.type,
    filters.year,
  ]);

  const handleGetCompany = useCallback(async (tradeUnionName: any) => {
    const { data: newData } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/tradeUnion/findByName`,
      {
        name: tradeUnionName,
      }
    );

    const tradeUnionId = await newData.tradeUnion._id;

    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/company/listByTradeUnion`,
      {
        tradeUnion: tradeUnionId,
      }
    );

    setCompany(data.companies.map((item: any) => item.name));
    // console.log('Company', data.companies);
  }, []);

  const handleFilters = useCallback(
    async (name: string, value: IUserTableFilterValue) => {
      onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'tradeUnion') {
        await handleGetCompany(value);
      }
    },
    [onResetPage, handleGetCompany]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/contact/removeContactByInternId`, {
        internId: id,
      });
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/removeInternFromAll`, {
        internId: id,
      });
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/study/removeStudyByInternId`, {
        internId: id,
      });
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/delete`, {
        _id: id,
      });

      // Tải lại từ server thay vì tự cắt mảng: bảng chỉ giữ trang hiện tại,
      // xoá xong thì tổng số và các trang sau đều đổi.
      reload();
    },
    [reload]
  );

  const handleDeleteRows = useCallback(() => {
    // Bảng đã phân trang phía server nên không tự cắt mảng nữa; tải lại cho chắc.
    table.onSelectAllRows(false, []);
    reload();
  }, [table, reload]);

  const handleAddInternIntoOrder = useCallback(async () => {
    // const seletedRows = tableData.filter((row) => table.selected.includes(row._id));

    const listIntern = table.selected;
    await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/updateListIntern`, {
      _id: orderSelect?.value,
      listIntern,
    });
    enqueueSnackbar('Thêm thực tập sinh vào đơn hàng thành công!');
  }, [table, orderSelect, enqueueSnackbar]);

  // In hợp đồng cho các dòng đang chọn. Bảng chỉ có 12 trường của trang hiện tại, còn
  // hợp đồng cần hồ sơ đầy đủ + công ty đã populate, nên tải lại từng người qua
  // GET /api/user/:id — tối đa 6 lượt song song, giữ đúng thứ tự đang hiện trên bảng.
  const loadSelectedInterns = useCallback(async () => {
    const ids = tableData.map((row) => row._id).filter((id) => table.selected.includes(id));
    const result: any[] = new Array(ids.length);
    let next = 0;
    const worker = async () => {
      while (next < ids.length) {
        const index = next;
        next += 1;
        // eslint-disable-next-line no-await-in-loop
        const { data } = await axios.get(
          `${process.env.REACT_APP_HOST_API}/api/user/${ids[index]}`
        );
        result[index] = data?.intern;
      }
    };
    await Promise.all(Array.from({ length: Math.min(6, ids.length) }, worker));
    return result.filter(Boolean);
  }, [tableData, table.selected]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.intern.edit(id));
    },
    [router]
  );

  const handleEditIsuzuRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.intern.editIsuzu(id));
    },
    [router]
  );

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
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`, {
        params: {
          ...filterParams,
          page: table.page,
          limit: table.rowsPerPage,
          sortBy: table.orderBy,
          sortOrder: table.order,
        },
      });

      setTableData(data.interns);
      setTotal(data.total ?? data.interns.length);
      setStatusCounts(data.statusCounts ?? {});
    } catch (error) {
      enqueueSnackbar((error as any)?.response?.data?.message || 'Không tải được danh sách', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [filterParams, table.page, table.rowsPerPage, table.orderBy, table.order, enqueueSnackbar]);

  /**
   * Lấy trọn bộ kết quả đã lọc, không phân trang — dùng cho xuất Excel và PDF điểm danh.
   * Gọi không kèm tham số `page` nên server trả về đủ trường, chỉ những hồ sơ khớp bộ lọc.
   */
  const fetchAllInterns = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`, {
      params: filterParams,
    });
    return data.interns as IInternItem[];
  }, [filterParams]);

  // Tài khoản demo chỉ xem một danh sách đã gán sẵn, thường rất ngắn nên chưa cần
  // phân trang phía server. Vẫn cập nhật total/statusCounts để giao diện thống nhất.
  const handleGetAllInternDemo = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/user/listByDemo`, {
        internsDemo: userRole?.internsDemo,
      });

      setTableData(data.interns);
      setTotal(data.interns.length);
      setStatusCounts(
        data.interns.reduce(
          (acc: Record<string, number>, item: IInternItem) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            acc.all += 1;
            return acc;
          },
          { all: 0 }
        )
      );
    } catch (error) {
      enqueueSnackbar((error as any)?.response?.data?.message || 'Không tải được danh sách', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [userRole, enqueueSnackbar]);

  const handleGetTradeUnion = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/list`);
    setTradeUnion(data.tradeUnions.map((item: any) => item.name));
    // console.log(data.tradeUnions);
  }, []);

  const handleGetSource = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/source/list`);
    setSource(data.sources.map((item: any) => item.name));
    // console.log(data.tradeUnions);
  }, []);

  const handleGetOrder = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/order/list`);
    setOrders(data.orders.map((item: any) => ({ text: item.name, value: item._id })));
  }, []);

  // Danh sách nghiệp đoàn / nguồn / đơn hàng chỉ để đổ vào bộ lọc — nạp một lần,
  // không nạp lại mỗi khi đổi trang hay đổi bộ lọc.
  useEffect(() => {
    handleGetTradeUnion();
    handleGetSource();
    handleGetOrder();
  }, [handleGetTradeUnion, handleGetSource, handleGetOrder]);

  // Bảng nạp lại khi đổi trang, đổi sắp xếp, đổi bộ lọc, hoặc sau khi xoá.
  useEffect(() => {
    if (userRole?.role === 'demo') {
      handleGetAllInternDemo();
    } else {
      handleGetAllIntern();
    }
  }, [handleGetAllIntern, handleGetAllInternDemo, userRole, reloadToken]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('list') || ''}
          links={[
            { name: t('dashboard') || '', href: paths.dashboard.root },
            { name: t('intern') || '', href: paths.dashboard.intern.root },
            { name: t('list') || '' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.intern.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('new_intern')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
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
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'study' && 'success') ||
                      (tab.value === 'pass' && 'warning') ||
                      (tab.value === 'complete' && 'error') ||
                      (tab.value === 'soon' && 'info') ||
                      'default'
                    }
                  >
                    {/* Số đếm do server tính trên toàn bộ tập đã lọc, không phải trang hiện tại. */}
                    {statusCounts[tab.value] ?? 0}
                    {/* {tab.value === 'rejected' &&
                      dataFiltered.filter((user) => user.status === 'rejected').length} */}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InternTableToolbarWithSource
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={tradeUnion}
            companyOptions={company}
            sources={source}
            interns={tableData}
            fetchAllInterns={fetchAllInterns}
          />

          {canReset && (
            <InternTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={total}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
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
                <Tooltip title="Thêm vào danh sách so sánh">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="streamline-ultimate:ranking-people-first-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <InternContractButton
                    loadInterns={loadSelectedInterns}
                    size={table.dense ? 'small' : 'medium'}
                  />
                  <Tooltip title="Thêm vào đơn hàng">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="streamline-ultimate:job-responsibility-bag-hand-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
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
                  {tableData.map((row) => (
                    <InternTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={table.onSelectRow}
                      onDeleteRow={handleDeleteRow}
                      onEditRow={handleEditRow}
                      onEditIsuzuRow={handleEditIsuzuRow}
                      onViewRow={handleViewRow}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, total)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Thêm thực tập sinh vào đơn hàng"
        content={
          <>
            <Autocomplete
              disablePortal
              options={orders}
              getOptionLabel={(option) => option?.text || ''}
              fullWidth
              value={orderSelect}
              onChange={(event, newValue) => setOrderSelect(newValue)}
              renderInput={(params) => <TextField {...params} label="Đơn hàng" />}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.text}
                </li>
              )}
            />
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              // handleDeleteRows();
              handleAddInternIntoOrder();
              confirm.onFalse();
            }}
          >
            Thêm
          </Button>
        }
      />
    </>
  );
}
