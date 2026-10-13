import { useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IOrderItem } from 'src/types/order';
// locales
import { useLocales } from 'src/locales';
// utils
import ExportInternsPass from 'src/utils/ExportInternsPass';
import ExportInternsWithAvatar from 'src/utils/ExportInternsWithAvatar';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import SwapForm from '../user/swap-form';

// ----------------------------------------------------------------------
// Một dòng đơn hàng + danh sách TTS khi mở rộng + menu In CV / xuất file.
//
// - Danh sách đậu (order.listInternPass) nằm trên từng đơn: một TTS có thể đậu nhiều đơn.
//   Khi mở rộng, TTS chia 2 nhóm: Đậu ở trên, Ứng viên còn lại ở dưới; số thứ tự giữ theo
//   danh sách ứng viên gốc (để "Đổi số thứ tự" vẫn đúng nghĩa).
// - Bộ lọc nguồn chỉ lọc TTS bên trong đơn (danh sách hiển thị và file xuất), không lọc đơn.
// - Thư viện PDF và các mẫu CV chỉ nạp khi bấm (trước đây import tĩnh cả 8 mẫu).
// ----------------------------------------------------------------------

type CvTemplate = {
  key: string;
  label: string;
  group: 'cv' | 'isuzu';
  load: () => Promise<{ default: any }>;
};

type PrintList = 'candidates' | 'passed';

type Props = {
  row: IOrderItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onRemoveIntern: (orderId: string, internId: string) => void;
  onViewInternRow: (id: string) => void;
  onEditRow: VoidFunction;
  onHandleGetOrder: VoidFunction;
  onTogglePass: (orderId: string, internId: string, pass: boolean) => Promise<void>;
  // null = không lọc nguồn
  matchesSource: ((intern: any) => boolean) | null;
  getSourceName: (intern: any) => string;
  colSpan: number;
  // Bảng rộng hơn khung nhìn (điện thoại, tablet): giữ khung danh sách TTS vừa màn hình
  // để bấm được nút mà không phải cuộn ngang. undefined = bảng không cần cuộn.
  panelWidth?: number;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
};

export default function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onRemoveIntern,
  onViewInternRow,
  onEditRow,
  onHandleGetOrder,
  onTogglePass,
  matchesSource,
  getSourceName,
  colSpan,
  panelWidth,
}: Props) {
  const {
    status,
    name,
    work,
    priority,
    recruitmentDate,
    interviewFormat,
    quantity,
    listIntern,
    listInternPass,
    _id,
    createdAt,
  } = row;

  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();
  const quickSwap = useBoolean();

  const [internSelect, setInternSelect] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [printList, setPrintList] = useState<PrintList>('candidates');

  const passSet = useMemo(() => new Set((listInternPass || []).map(String)), [listInternPass]);

  // Số thứ tự theo danh sách ứng viên gốc, kể cả khi đang lọc nguồn.
  const candidates = useMemo(
    () => (listIntern || []).map((intern: any, index: number) => ({ intern, no: index + 1 })),
    [listIntern]
  );

  const visible = useMemo(
    () => (matchesSource ? candidates.filter((c: any) => matchesSource(c.intern)) : candidates),
    [candidates, matchesSource]
  );
  const passedVisible = visible.filter((c: any) => passSet.has(String(c.intern._id)));
  const othersVisible = visible.filter((c: any) => !passSet.has(String(c.intern._id)));
  const passedTotal = candidates.filter((c: any) => passSet.has(String(c.intern._id))).length;

  // Gắn số thứ tự gốc (orderNo) để file xuất in đúng số trong đơn, kể cả khi in danh sách
  // đậu hay đang lọc nguồn — các mẫu CV/Excel dùng orderNo thay cho số đếm 1..N.
  const printInterns = (printList === 'passed' ? passedVisible : visible).map((c: any) => ({
    ...c.intern,
    orderNo: c.no,
  }));

  const cvTemplates: CvTemplate[] = [
    {
      key: 'score',
      group: 'cv',
      label: t('order_cv_score'),
      load: () => import('./AllInternsPDF'),
    },
    {
      key: 'noScore',
      group: 'cv',
      label: t('order_cv_no_score'),
      load: () => import('./AllInternsPDFNoScore'),
    },
    {
      key: 'noScoreKraepelin',
      group: 'cv',
      label: t('order_cv_no_score_cumulative'),
      load: () => import('./AllInternsPDFNoScoreKraepelin'),
    },
    {
      key: 'iq',
      group: 'cv',
      label: t('order_cv_iq'),
      load: () => import('./AllInternsPDFNoScoreIQ'),
    },
    {
      key: 'iqPushUp',
      group: 'cv',
      label: t('order_cv_iq_pushup'),
      load: () => import('./AllInternsPDFNoScoreIQAndPushUp'),
    },
    {
      key: 'isuzu',
      group: 'isuzu',
      label: t('order_cv_score'),
      load: () => import('./AllInternsPDFIsuzu'),
    },
    {
      key: 'isuzuNoScore',
      group: 'isuzu',
      label: t('order_cv_no_score'),
      load: () => import('./AllInternsPDFNoScoreIsuzu'),
    },
    {
      key: 'isuzu1YearNoScore',
      group: 'isuzu',
      label: t('order_cv_isuzu_1year_no_score'),
      load: () => import('./AllInternsPDFNoScoreIsuzu1Year'),
    },
  ];

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    // Đã có người đậu thì mặc định in danh sách đậu.
    setPrintList(passedVisible.length ? 'passed' : 'candidates');
    popover.onOpen(event);
  };

  const handleDownloadCv = async (template: CvTemplate) => {
    if (!printInterns.length || busyKey) return;
    setBusyKey(template.key);
    try {
      const [{ pdf }, { default: Document }] = await Promise.all([
        import('@react-pdf/renderer'),
        template.load(),
      ]);
      const blob = await pdf(<Document interns={printInterns} />).toBlob();
      saveAs(blob, printList === 'passed' ? `CV_dau_${name}.pdf` : `All_CVs_${name}.pdf`);
      popover.onClose();
    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error);
      enqueueSnackbar(t('order_export_failed'), { variant: 'error' });
    } finally {
      setBusyKey(null);
    }
  };

  const handleTogglePass = async (internId: string, pass: boolean) => {
    setPendingId(internId);
    try {
      await onTogglePass(_id, internId, pass);
    } finally {
      setPendingId(null);
    }
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={name}
          secondary={work}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell>{priority}</TableCell>

      <TableCell>{changDateJP(recruitmentDate)}</TableCell>

      <TableCell align="center">{interviewFormat}</TableCell>

      {/* Số đậu / số lượng cần tuyển */}
      <TableCell>
        <Label
          variant="soft"
          color={passedTotal > 0 && passedTotal >= quantity ? 'success' : 'default'}
        >
          {passedTotal}/{quantity}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Đang tuyển' && 'success') ||
            (status === 'Đã tuyển đủ' && 'warning') ||
            (status === 'Tạm ngưng tuyển' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell>{changDateJP(createdAt)}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderIntern = ({ intern, no }: { intern: any; no: number }) => {
    const passed = passSet.has(String(intern._id));

    return (
      <Stack
        key={intern._id}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 1, sm: 1.5 }}
        sx={{
          px: 1.5,
          py: 1.25,
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
          <Avatar src={intern.avatar} variant="rounded" sx={{ width: 44, height: 44 }} />
          <ListItemText
            onClick={() => onViewInternRow(intern._id)}
            sx={{
              cursor: 'pointer',
              minWidth: 0,
              '&:hover .MuiListItemText-primary': { textDecoration: 'underline' },
            }}
            primary={`${no}. ${intern.name}`}
            secondary={`${intern.namejp || ''}${intern.namejp ? ' · ' : ''}${getSourceName(
              intern
            )}`}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled', noWrap: true }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
          <Tooltip title={passed ? t('order_unmark_pass_tip') : t('order_mark_pass_tip')}>
            <LoadingButton
              variant={passed ? 'soft' : 'outlined'}
              color={passed ? 'success' : 'inherit'}
              loading={pendingId === intern._id}
              disabled={!!pendingId && pendingId !== intern._id}
              startIcon={
                <Iconify icon={passed ? 'eva:checkmark-circle-2-fill' : 'eva:checkmark-fill'} />
              }
              onClick={() => handleTogglePass(intern._id, !passed)}
              sx={{ minHeight: { xs: 44, sm: 40 }, whiteSpace: 'nowrap' }}
            >
              {passed ? t('order_passed') : t('order_mark_pass')}
            </LoadingButton>
          </Tooltip>

          <Tooltip title={t('order_swap_order')}>
            <IconButton
              sx={{ p: { xs: 1.5, sm: 1 } }}
              onClick={() => {
                setInternSelect(intern._id);
                quickSwap.onTrue();
              }}
            >
              <Iconify icon="ri:swap-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('order_remove_intern')}>
            <IconButton
              color="error"
              sx={{ p: { xs: 1.5, sm: 1 } }}
              onClick={() => onRemoveIntern(_id, intern._id)}
            >
              <Iconify icon="mdi:trash" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  };

  const renderGroup = (
    title: string,
    items: { intern: any; no: number }[],
    color: 'success' | 'default'
  ) =>
    items.length > 0 && (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.5, pt: 1.5, pb: 0.5 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Label variant="soft" color={color}>
            {items.length}
          </Label>
        </Stack>
        {items.map(renderIntern)}
      </Box>
    );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={colSpan}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper
            sx={{
              m: 1.5,
              ...(panelWidth && { position: 'sticky', left: 12, width: panelWidth - 24 }),
            }}
          >
            {!candidates.length && (
              <Typography variant="body2" sx={{ p: 2, color: 'text.disabled' }}>
                {t('order_no_candidates')}
              </Typography>
            )}

            {!!candidates.length && !visible.length && (
              <Typography variant="body2" sx={{ p: 2, color: 'text.disabled' }}>
                {t('order_no_source_match')}
              </Typography>
            )}

            {renderGroup(t('order_group_passed'), passedVisible, 'success')}

            {passedVisible.length > 0 && othersVisible.length > 0 && <Divider />}

            {renderGroup(
              passedVisible.length ? t('order_group_others') : t('order_list_candidates'),
              othersVisible,
              'default'
            )}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const groupTitle = (text: string) => (
    <Typography
      variant="overline"
      component="div"
      sx={{ px: 1, pt: 1.5, pb: 0.5, color: 'text.disabled', lineHeight: 1.5 }}
    >
      {text}
    </Typography>
  );

  const renderCvItem = (template: CvTemplate) => (
    <MenuItem
      key={template.key}
      disabled={!printInterns.length || (!!busyKey && busyKey !== template.key)}
      onClick={() => handleDownloadCv(template)}
    >
      {busyKey === template.key ? (
        <CircularProgress size={18} sx={{ mr: 2 }} />
      ) : (
        <Iconify icon="solar:file-text-bold" />
      )}
      {template.label}
    </MenuItem>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <SwapForm
        orderId={_id}
        internId={internSelect}
        internName={internSelect}
        open={quickSwap.value}
        onClose={quickSwap.onFalse}
        onHandleGetOrder={onHandleGetOrder}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{
          width: 280,
          maxHeight: { xs: '70vh', md: 'none' },
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Chọn danh sách in: mọi mẫu bên dưới dùng chung lựa chọn này (và bộ lọc nguồn). */}
        <Box sx={{ px: 1, pt: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}
          >
            {t('order_print_for')}
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={printList}
            onChange={(event, value: PrintList | null) => value && setPrintList(value)}
          >
            <ToggleButton value="candidates">
              {t('order_list_candidates')} ({visible.length})
            </ToggleButton>
            <ToggleButton value="passed">
              {t('order_list_passed')} ({passedVisible.length})
            </ToggleButton>
          </ToggleButtonGroup>
          {!printInterns.length && (
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', display: 'block', mt: 0.75 }}
            >
              {t('order_print_empty')}
            </Typography>
          )}
        </Box>

        {groupTitle(t('order_group_cv'))}
        {cvTemplates.filter((item) => item.group === 'cv').map(renderCvItem)}

        {groupTitle(t('order_group_cv_isuzu'))}
        {cvTemplates.filter((item) => item.group === 'isuzu').map(renderCvItem)}

        {groupTitle(t('order_group_excel'))}
        <ExportInternsWithAvatar
          interns={printInterns}
          name={name}
          label={t('order_excel_avatar') || ''}
          disabled={!printInterns.length || !!busyKey}
        />
        <ExportInternsPass
          interns={printInterns}
          name={name}
          label={t('order_excel_detail') || ''}
          disabled={!printInterns.length || !!busyKey}
        />

        <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditRow();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('order_edit')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
