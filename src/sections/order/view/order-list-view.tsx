import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
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
// types
import { IOrderItem, IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { isDateError } from 'src/components/custom-date-range-picker';
import { useSnackbar } from 'src/components/snackbar';
// locales
import { useLocales } from 'src/locales';
// utils
import { DEFAULT_SOURCE_NAME, sourceIdOf } from 'src/utils/source';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

//
import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];
const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'Đang tuyển', label: 'Đang Tuyển' },
  { value: 'Đã tuyển đủ', label: 'Đã Tuyển Đủ' },
  { value: 'Tạm ngưng tuyển', label: 'Tạm Ngưng Tuyển' },
  { value: 'Không tuyển nữa', label: 'Không Tuyển Nữa' },
];
const defaultFilters: IOrderTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  source: [],
};

// Số TTS đậu đơn — chỉ tính người còn là ứng viên. Lưu vào dòng để cột "Đậu" sắp xếp được.
const withPassCount = (order: IOrderItem): IOrderItem => {
  const candidates = new Set((order.listIntern || []).map((intern: any) => String(intern._id)));
  return {
    ...order,
    passCount: (order.listInternPass || []).filter((id) => candidates.has(String(id))).length,
  };
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const confirm = useBoolean();

  const { t } = useLocales();

  const [tableData, setTableData] = useState<IOrderItem[]>([]);

  const [filters, setFilters] = useState<IOrderTableFilters>(defaultFilters);

  const [sources, setSources] = useState<{ _id: string; name: string }[]>([]);

  const tableHead = useMemo(
    () => [
      // "Đậu / Số lượng" (vd 1/3) thay cho cột "Số Lượng" cũ: số lượng vẫn hiện ở mẫu số,
      // bớt một cột để cột Tên và ngày không bị bẻ dòng.
      { id: 'orderNumber', label: 'Tên', minWidth: 180 },
      { id: 'name', label: 'Ưu tiên', width: 100 },
      { id: 'recruitmentDate', label: 'Ngày Phỏng Vấn', width: 150 },
      { id: 'totalQuantity', label: 'Phỏng Vấn', width: 96, align: 'center' },
      { id: 'passCount', label: t('order_col_passed'), width: 110 },
      { id: 'status', label: 'Trạng Thái', width: 120 },
      { id: 'createdAt', label: 'Ngày Tạo', width: 150 },
      { id: '', width: 88 },
    ],
    [t]
  );

  // Bảng rộng tối thiểu 1000px: trên điện thoại/tablet phải cuộn ngang. Đo bề rộng khung để
  // giữ danh sách TTS (khi mở đơn) luôn vừa màn hình — xem panelWidth ở OrderTableRow.
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const element = tableBoxRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const update = () => {
      const width = element.clientWidth;
      setPanelWidth(width && width < 1000 ? width : undefined);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Lọc TTS bên trong từng đơn theo nguồn. "Nhật Tân" = TTS chưa có nguồn.
  const sourceOptions = useMemo(
    () => [
      DEFAULT_SOURCE_NAME,
      ...sources.map((item) => item.name).filter((item) => item !== DEFAULT_SOURCE_NAME),
    ],
    [sources]
  );

  const sourceNameById = useMemo(
    () => new Map(sources.map((item) => [String(item._id), item.name])),
    [sources]
  );

  const getSourceName = useCallback(
    (intern: any) => sourceNameById.get(sourceIdOf(intern)) || DEFAULT_SOURCE_NAME,
    [sourceNameById]
  );

  const matchesSource = useMemo(() => {
    if (!filters.source.length) return null;
    const ids = new Set(
      sources.filter((item) => filters.source.includes(item.name)).map((item) => String(item._id))
    );
    const includeNone = filters.source.includes(DEFAULT_SOURCE_NAME);
    return (intern: any) => {
      const id = sourceIdOf(intern);
      return id ? ids.has(id) : includeNone;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.source, sources]);

  const dateError = isDateError(filters.startDate, filters.endDate);

  // Bọc useMemo: trước đây applyFilter chạy lại ở MỌI lần render, mà nó sao chép
  // rồi sắp xếp toàn bộ mảng và lọc tuần tự — tốn nhất khi danh sách dài.
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
        dateError,
      }),
    [tableData, table.order, table.orderBy, filters, dateError]
  );

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate) ||
    filters.source.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row: any) => row._id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row: any) => !table.selected.includes(row._id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.edit(id));
    },
    [router]
  );

  const handleViewInternRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.intern.profile(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleGetAllOrder = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/order/list`);
    setTableData((data.orders || []).map(withPassCount));
  }, []);

  const handleGetSources = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/source/list`);
    setSources(data.sources || []);
  }, []);

  // Đánh dấu / bỏ đánh dấu đậu: cập nhật tại chỗ thay vì tải lại cả danh sách đơn
  // (mỗi đơn kèm hồ sơ đầy đủ của toàn bộ ứng viên — rất nặng).
  const handleTogglePass = useCallback(
    async (orderId: string, internId: string, pass: boolean) => {
      try {
        if (pass) {
          await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/updateListInternPass`, {
            _id: orderId,
            listInternPass: [internId],
          });
        } else {
          await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/removeInternPass`, {
            orderId,
            internId,
          });
        }
        setTableData((prev) =>
          prev.map((order) => {
            if (order._id !== orderId) return order;
            const ids = (order.listInternPass || []).map(String).filter((id) => id !== internId);
            return withPassCount({ ...order, listInternPass: pass ? [...ids, internId] : ids });
          })
        );
        enqueueSnackbar(pass ? t('order_pass_marked') : t('order_pass_unmarked'));
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.response?.data?.message || t('order_pass_failed'), {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, t]
  );

  // Gán nguồn nhanh: một TTS có thể là ứng viên của nhiều đơn, nên sửa tại chỗ ở mọi đơn có
  // TTS đó (không tải lại cả danh sách đơn). sourceId '' = về "Nhật Tân" (BE $unset).
  const handleChangeSource = useCallback(
    async (internId: string, sourceId: string) => {
      try {
        await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updateSource`, {
          _id: internId,
          source: sourceId || null,
        });
        setTableData((prev) =>
          prev.map((order) => {
            const list = order.listIntern || [];
            if (!list.some((intern: any) => String(intern._id) === internId)) return order;
            return {
              ...order,
              listIntern: list.map((intern: any) =>
                String(intern._id) === internId
                  ? { ...intern, source: sourceId || undefined }
                  : intern
              ),
            };
          })
        );
        enqueueSnackbar(
          t('order_source_saved', { name: sourceNameById.get(sourceId) || DEFAULT_SOURCE_NAME })
        );
        return true;
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.response?.data?.message || t('order_source_failed'), {
          variant: 'error',
        });
        return false;
      }
    },
    [enqueueSnackbar, sourceNameById, t]
  );

  const handleRemoveInternInOrder = useCallback(
    async (orderId: any, internId: any) => {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/removeIntern`, {
        orderId,
        internId,
      });
      await handleGetAllOrder();
      enqueueSnackbar('Xoá thực tập sinh thành công!');
    },
    [handleGetAllOrder, enqueueSnackbar]
  );

  useEffect(() => {
    handleGetAllOrder();
    handleGetSources();
  }, [handleGetAllOrder, handleGetSources]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh Sách"
          links={[
            {
              name: 'Bảng Điều Khiển',
              href: paths.dashboard.root,
            },
            {
              name: 'Đơn Hàng',
              href: paths.dashboard.order.root,
            },
            { name: 'Danh Sách' },
          ]}
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
                      (tab.value === 'Đang tuyển' && 'success') ||
                      (tab.value === 'Đã tuyển đủ' && 'warning') ||
                      (tab.value === 'Tạm ngưng tuyển' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData.length}
                    {tab.value === 'Đang tuyển' &&
                      tableData.filter((order: any) => order.status === 'Đang tuyển').length}

                    {tab.value === 'Đã tuyển đủ' &&
                      tableData.filter((order: any) => order.status === 'Đã tuyển đủ').length}
                    {tab.value === 'Tạm ngưng tuyển' &&
                      tableData.filter((order: any) => order.status === 'Tạm ngưng tuyển').length}
                    {tab.value === 'Không tuyển nữa' &&
                      tableData.filter((order: any) => order.status === 'Không tuyển nữa').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            sourceOptions={sourceOptions}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer ref={tableBoxRef} sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row: any) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1000 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={tableHead}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewInternRow={handleViewInternRow}
                        onRemoveIntern={handleRemoveInternInOrder}
                        onHandleGetOrder={handleGetAllOrder}
                        onTogglePass={handleTogglePass}
                        sources={sources}
                        onChangeSource={handleChangeSource}
                        matchesSource={matchesSource}
                        getSourceName={getSourceName}
                        colSpan={tableHead.length + 1}
                        panelWidth={panelWidth}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IOrderItem[];
  comparator: (a: any, b: any) => number;
  filters: IOrderTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) => order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
      // ||
      //   order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
      //   order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
      //   order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (order) =>
          fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(order.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
