import { m } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
// auth
import { useAuthContext } from 'src/auth/hooks';
// locales
import { useLocales } from 'src/locales';
// types
import { IAccountItem, IAccountTableFilters } from 'src/types/user';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import axios, { API_ENDPOINTS } from 'src/utils/axios';
import { roleAccount } from 'src/utils/role';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varFade } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import AccountTableRow from '../account-table-row';
import AccountTableToolbar from '../account-table-toolbar';
import AccountNewEditForm from '../account-new-edit-form';
import AccountResetPasswordForm from '../account-reset-password-form';

// ----------------------------------------------------------------------

const defaultFilters: IAccountTableFilters = {
  name: '',
  role: 'all',
};

// ----------------------------------------------------------------------

export default function AccountListView() {
  const { t } = useLocales();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  // Mặc định tài khoản mới nhất lên đầu, và hiển thị 10 dòng thay vì 5.
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc', defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const newAccount = useBoolean();

  const [tableData, setTableData] = useState<IAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [editingAccount, setEditingAccount] = useState<IAccountItem | null>(null);
  const [resettingAccount, setResettingAccount] = useState<IAccountItem | null>(null);

  const TABLE_HEAD = [
    { id: 'name', label: t('account_field_name'), width: 260 },
    { id: 'role', label: t('account_field_role'), width: 140 },
    { id: 'linked', label: t('account_field_linked'), width: 200 },
    { id: 'email', label: t('account_field_email'), width: 200 },
    { id: 'createdAt', label: t('create_date'), width: 130 },
    { id: '', width: 68 },
  ];

  const STATUS_OPTIONS = useMemo(
    () => [{ value: 'all', label: t('all') }, ...roleAccount.map((r) => ({ value: r.value, label: r.label }))],
    [t]
  );

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ENDPOINTS.account.list);
      setTableData(data.accounts || []);
    } catch (error) {
      enqueueSnackbar((error as any)?.message || t('account_load_error') || 'Load failed', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Lọc và sắp xếp trong useMemo: không tính lại ở mỗi lần render.
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
      }),
    [tableData, table.order, table.orderBy, filters]
  );

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !dataFiltered.length && !loading;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

  const handleFilterRole = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('role', newValue);
    },
    [handleFilters]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axios.put(API_ENDPOINTS.account.delete, { _id: id });
        enqueueSnackbar(t('account_deleted') || 'Account deleted');
        // Đọc lại từ server thay vì tự cắt mảng ở client, để danh sách luôn khớp CSDL.
        fetchAccounts();
      } catch (error) {
        enqueueSnackbar((error as any)?.message || t('account_delete_error') || 'Delete failed', {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, fetchAccounts, t]
  );

  const handleEditRow = useCallback((row: IAccountItem) => {
    setEditingAccount(row);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingAccount(null);
  }, []);

  const renderSkeleton = [...Array(5)].map((_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`} sx={{ height: denseHeight }}>
      {TABLE_HEAD.map((cell, cellIndex) => (
        <TableCell key={cell.id || `cell-${cellIndex}`}>
          <Skeleton variant="text" sx={{ width: cellIndex === 0 ? '70%' : '50%' }} />
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <m.div initial="initial" animate="animate" variants={varFade({ distance: 24 }).inUp}>
          <CustomBreadcrumbs
            heading={t('account_management') || ''}
            links={[
              { name: t('dashboard') || '', href: paths.dashboard.root },
              { name: t('account_management') || '' },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={newAccount.onTrue}
              >
                {t('account_new_title')}
              </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </m.div>

        <m.div initial="initial" animate="animate" variants={varFade({ distance: 24 }).inUp}>
          <Card>
            <Tabs
              value={filters.role}
              onChange={handleFilterRole}
              variant="scrollable"
              scrollButtons="auto"
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
                        ((tab.value === 'all' || tab.value === filters.role) && 'filled') || 'soft'
                      }
                      color={tab.value === 'admin' ? 'error' : 'default'}
                    >
                      {tab.value === 'all'
                        ? tableData.length
                        : tableData.filter((item) => item.role === tab.value).length}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <AccountTableToolbar filters={filters} onFilters={handleFilters} />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 880 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {loading
                      ? renderSkeleton
                      : dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row) => (
                            <AccountTableRow
                              key={row._id}
                              row={row}
                              isCurrentUser={`${(user as any)?._id || (user as any)?.id}` === `${row._id}`}
                              onEditRow={() => handleEditRow(row)}
                              onResetPassword={() => setResettingAccount(row)}
                              onDeleteRow={() => handleDeleteRow(row._id)}
                            />
                          ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
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
        </m.div>
      </Container>

      <AccountNewEditForm
        open={newAccount.value}
        onClose={newAccount.onFalse}
        onSaved={fetchAccounts}
      />

      <AccountNewEditForm
        open={!!editingAccount}
        currentAccount={editingAccount}
        onClose={handleCloseEdit}
        onSaved={fetchAccounts}
      />

      <AccountResetPasswordForm
        open={!!resettingAccount}
        account={resettingAccount}
        onClose={() => setResettingAccount(null)}
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
  inputData: IAccountItem[];
  comparator: (a: any, b: any) => number;
  filters: IAccountTableFilters;
}) {
  const { name, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  if (name) {
    const search = name.toLowerCase();
    data = data.filter(
      (item) =>
        item.name?.toLowerCase().includes(search) || item.username?.toLowerCase().includes(search)
    );
  }

  if (role !== 'all') {
    data = data.filter((item) => item.role === role);
  }

  return data;
}
