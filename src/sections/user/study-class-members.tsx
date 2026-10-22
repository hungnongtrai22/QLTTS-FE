import axios from 'axios';
import { useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { fDate } from 'src/utils/format-time';
import { DEFAULT_SOURCE_NAME } from 'src/utils/source';
// types
import { IStudyClassMember } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';
//
import { INTERN_STATUS } from './study-class-utils';
import StudyClassAddDialog from './study-class-add-dialog';

// ----------------------------------------------------------------------

type Props = {
  classId: string;
  className: string;
  // null = đang tải
  members: IStudyClassMember[] | null;
  onChanged: VoidFunction;
};

export default function StudyClassMembers({ classId, className, members, onChanged }: Props) {
  const { t } = useLocales();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'name' });

  const { selected, onSelectRow, onSelectAllRows } = table;

  const [addOpen, setAddOpen] = useState(false);

  // Gỡ khỏi lớp: chờ xác nhận (id TTS).
  const [removeIds, setRemoveIds] = useState<string[]>([]);

  const [removing, setRemoving] = useState(false);

  const rows = members || [];

  const allIds = rows.map((row) => row._id);

  const tableHead = mdUp
    ? [
        { id: 'name', label: t('study_report_col_intern'), minWidth: 240 },
        { id: 'company', label: t('study_report_col_company'), width: 260 },
        { id: 'source', label: t('source'), width: 140 },
        { id: 'status', label: t('status'), width: 130 },
        { id: 'studyDate', label: t('study_class_study_date'), width: 120 },
        { id: '', width: 64 },
      ]
    : [
        { id: 'name', label: t('study_report_col_intern') },
        { id: '', width: 56 },
      ];

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updateStudyClass`, {
        ids: removeIds,
        studyClass: null,
      });
      enqueueSnackbar(t('study_class_removed', { count: removeIds.length }));
      setRemoveIds([]);
      onSelectAllRows(false, []);
      onChanged();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_assign_failed'), {
        variant: 'error',
      });
    } finally {
      setRemoving(false);
    }
  };

  const renderStatus = (status: string) => {
    const info = INTERN_STATUS[status];
    return info ? (
      <Label variant="soft" color={info.color}>
        {t(info.label)}
      </Label>
    ) : null;
  };

  const renderRemove = (id: string) => (
    <Tooltip title={t('study_class_remove')}>
      <IconButton
        color="error"
        onClick={() => setRemoveIds([id])}
        sx={{ width: 44, height: 44 }}
        aria-label={t('study_class_remove') || ''}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Card>
      <CardHeader
        title={t('study_class_members', { count: rows.length })}
        subheader={t('study_class_members_hint')}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setAddOpen(true)}
            sx={{ minHeight: 44 }}
          >
            {t('study_class_add')}
          </Button>
        }
        sx={{
          pb: 2,
          flexWrap: 'wrap',
          rowGap: 1.5,
          '& .MuiCardHeader-action': { alignSelf: 'center', m: 0 },
        }}
      />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          numSelected={selected.length}
          rowCount={allIds.length}
          onSelectAllRows={(checked) => onSelectAllRows(checked, allIds)}
          action={
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setRemoveIds(selected)}
              sx={{ minHeight: { xs: 44, md: 30 } }}
            >
              {t('study_class_remove_n', { count: selected.length })}
            </Button>
          }
        />
        <Scrollbar>
          <Table sx={{ minWidth: mdUp ? 820 : 0 }}>
            <TableHeadCustom
              headLabel={tableHead}
              rowCount={allIds.length}
              numSelected={selected.length}
              onSelectAllRows={(checked) => onSelectAllRows(checked, allIds)}
              sx={{ '& th': { whiteSpace: 'nowrap' } }}
            />
            <TableBody>
              {!members && [...Array(4)].map((_, index) => <TableSkeleton key={index} />)}

              {rows.map((row) => (
                <TableRow key={row._id} hover selected={selected.includes(row._id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row._id)}
                      onClick={() => onSelectRow(row._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={row.avatar} alt={row.name} />
                      <ListItemText
                        primary={row.name}
                        secondary={row.namejp}
                        primaryTypographyProps={{ typography: 'subtitle2' }}
                        secondaryTypographyProps={{ component: 'span' }}
                      />
                    </Stack>
                    {!mdUp && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        {row.status !== 'study' && renderStatus(row.status)}
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {row.company || row.tradeUnion}
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>
                  {mdUp && (
                    <>
                      <TableCell sx={{ maxWidth: 260 }}>
                        {/* Tên nghiệp đoàn có thể rất dài: một dòng, xem đủ khi rê chuột. */}
                        <ListItemText
                          primary={row.company || '—'}
                          secondary={row.tradeUnion}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{
                            component: 'span',
                            noWrap: true,
                            title: row.tradeUnion,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.source || DEFAULT_SOURCE_NAME}</TableCell>
                      <TableCell>{renderStatus(row.status)}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {row.studyDate ? fDate(row.studyDate, 'dd/MM/yyyy') : '—'}
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right" sx={{ px: 1 }}>
                    {renderRemove(row._id)}
                  </TableCell>
                </TableRow>
              ))}

              {members && !rows.length && (
                <TableRow>
                  <TableCell colSpan={12} sx={{ p: 0 }}>
                    <EmptyContent
                      filled
                      title={t('study_class_members_empty') || ''}
                      description={t('study_class_members_empty_hint') || ''}
                      sx={{ py: 6, m: 2 }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* Chỉ dựng khi mở: hộp thoại tự tải danh sách TTS đang học. */}
      {addOpen && (
        <StudyClassAddDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          classId={classId}
          className={className}
          onAdded={onChanged}
        />
      )}

      <ConfirmDialog
        open={removeIds.length > 0}
        onClose={() => setRemoveIds([])}
        title={t('study_class_remove_title', { count: removeIds.length })}
        content={t('study_class_remove_content', { name: className })}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={removing}
            onClick={handleRemove}
          >
            {t('study_class_remove')}
          </LoadingButton>
        }
      />
    </Card>
  );
}
