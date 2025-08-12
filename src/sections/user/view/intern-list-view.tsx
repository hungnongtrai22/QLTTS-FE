import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
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
import { IInternItem, IInternTableFilters, IUserTableFilterValue } from 'src/types/user';
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
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, TextField } from '@mui/material';

import axios from 'axios';

//
import InternTableRow from '../intern-table-row';
import InternTableToolbar from '../intern-table-toolbar';
import InternTableFiltersResult from '../intern-table-filters-result';
import InternTableToolbarWithSource from '../intern-table-toolbar-with-source';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'Tất cả' }, ...USER_STATUS_OPTIONS];

const defaultFilters = {
  name: '',
  // role: [],
  tradeUnion: [],
  source: [],
  company: [],
  status: 'all',
};

interface Order {
  value: string;
  text: string;
}

// ----------------------------------------------------------------------

export default function InternListView() {
  const { t } = useLocales();

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
    { value: 'study', label: t('studying') },
    { value: 'pass', label: t('pass') },
    { value: 'complete', label: t('complete') },
    { value: 'soon', label: t('soon') },
  ];

  const table = useTable();

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

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
    console.log('Company', data.companies);
  }, []);

  const handleFilters = useCallback(
    async (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'tradeUnion') {
        await handleGetCompany(value);
      }
    },
    [table, handleGetCompany]
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
      const deleteRow = tableData.filter((row) => row._id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleAddInternIntoOrder = useCallback(async () => {
    // const seletedRows = tableData.filter((row) => table.selected.includes(row._id));

    const listIntern = table.selected;
    await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/updateListIntern`, {
      _id: orderSelect?.value,
      listIntern,
    });
    enqueueSnackbar('Thêm thực tập sinh vào đơn hàng thành công!');
  }, [table, orderSelect, enqueueSnackbar]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.intern.edit(id));
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
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`);
    console.log(data.interns);
    setTableData(data.interns);
  }, []);

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

  useEffect(() => {
    handleGetAllIntern();
    handleGetTradeUnion();
    handleGetSource();
    handleGetOrder();
  }, [handleGetAllIntern, handleGetTradeUnion, handleGetOrder, handleGetSource]);

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
                    {tab.value === 'all' && dataFiltered.length}
                    {tab.value === 'study' &&
                      dataFiltered.filter((user) => user.status === 'study').length}

                    {tab.value === 'pass' &&
                      dataFiltered.filter((user) => user.status === 'pass').length}
                    {tab.value === 'complete' &&
                      dataFiltered.filter((user) => user.status === 'complete').length}
                    {tab.value === 'soon' &&
                      dataFiltered.filter((user) => user.status === 'soon').length}
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
                <Tooltip title="Thêm vào đơn hàng">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="streamline-ultimate:job-responsibility-bag-hand-bold" />
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
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InternTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
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

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IInternItem[];
  comparator: (a: any, b: any) => number;
  filters: IInternTableFilters;
}) {
  const { name, tradeUnion, status, company, source } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
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

  if (source?.length) {
    inputData = inputData.filter((user) => source.includes(user?.source?.name));
  }

  return inputData;
}
