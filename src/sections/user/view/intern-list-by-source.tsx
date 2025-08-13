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
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import { t } from 'i18next';

//
import InternTableFiltersResult from '../intern-table-filters-result';
import InternByTradeUnionTableToolbar from '../intern-by-trade-union-table-toolbar';
import InternByTradeUnionTableRow from '../intern-by-trade-union-table-row';
import InternBySourceTableToolbar from '../intern-by-source-table-toolbar';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  // role: [],
  tradeUnion: [],
  status: 'all',
  company: [],
};

// ----------------------------------------------------------------------

export default function InternListBySource() {
  const table = useTable();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const router = useRouter();

  const confirm = useBoolean();

  const TABLE_HEAD = [
    { id: 'companySelect', label: t('name'), width: 310 },
    { id: 'state', label: t('company_name'), width: 100 },
    { id: 'birthday', label: t('birthday'), width: 120 },
    { id: 'interviewDate', label: t('date_interview'), width: 120 },
    { id: 'studyDate', label: t('date_study'), width: 120 },
    { id: 'startDate', label: t('date_import'), width: 120 },
    { id: '', width: 50 },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'study', label: t('studying') },
    { value: 'pass', label: t('pass') },
    { value: 'complete', label: t('complete') },
    { value: 'soon', label: t('soon') },
  ];

  const [tableData, setTableData] = useState<IInternItem[]>([]);
  const [tradeUnion, setTradeUnion] = useState([]);
  const [company, setCompany] = useState([]);

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

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
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

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.intern.edit(id));
    },
    [router]
  );

  // const handleViewRow = useCallback(
  //   (id: string) => {
  //     router.push(paths.dashboard.intern.profile(id));
  //   },
  //   [router]
  // );

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
    // console.log('USER', user);
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/user/listBySource`, {
      source: user?.source,
    });
    setTableData(data.interns);
  }, [user]);

  const handleGetTradeUnion = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/list`);
    setTradeUnion(data.tradeUnions.map((item: any) => item.name));
    // console.log(data.tradeUnions);
  }, []);

  const handleGetCompany = useCallback(async () => {
    // const { data: newData } = await axios.get(
    //   `${process.env.REACT_APP_HOST_API}/api/tradeUnion/${tradeUnion}`
    // );

    // const tradeUnionId = await newData.tradeUnion._id;

    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/company/listByTradeUnion`,
      {
        tradeUnion: user?.tradeUnion,
      }
    );

    setCompany(data.companies.map((item: any) => item.name));
    console.log('Company', data.companies);
  }, [user]);

  useEffect(() => {
    handleGetAllIntern();
    handleGetCompany();
  }, [handleGetAllIntern, handleGetCompany]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}

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
                    {tab.value === 'all' && tableData.length}
                    {tab.value === 'study' &&
                      tableData.filter((intern) => intern.status === 'study').length}

                    {tab.value === 'pass' &&
                      tableData.filter((intern) => intern.status === 'pass').length}
                    {tab.value === 'complete' &&
                      tableData.filter((intern) => intern.status === 'complete').length}
                    {tab.value === 'soon' &&
                      tableData.filter((intern) => intern.status === 'soon').length}
                    {/* {tab.value === 'rejected' &&
                                dataFiltered.filter((user) => user.status === 'rejected').length} */}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InternBySourceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={tradeUnion}
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
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

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
                      <InternByTradeUnionTableRow
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
}: {
  inputData: IInternItem[];
  comparator: (a: any, b: any) => number;
  filters: IInternTableFilters;
}) {
  const { name, tradeUnion, company, status } = filters;

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

  return inputData;
}
