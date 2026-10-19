// @mui
import { alpha, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// locales
import { useLocales } from 'src/locales';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IStudyAttentionReason, IStudyReportRow, IStudyReportStatus } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export type StudyReportViewRow = IStudyReportRow & {
  reportStatus: IStudyReportStatus;
  total: number | null;
  delta: number | null;
  // Lý do "Cần chú ý" (rỗng = không cần chú ý)
  reasons: IStudyAttentionReason[];
  attention: boolean;
  teacherName: string;
  // Tên nguồn để lọc; TTS chưa có nguồn là "Nhật Tân"
  sourceName: string;
  // TTS nhập học ngay trong tháng đang xem
  isNew: boolean;
};

export const STATUS_COLOR: Record<IStudyReportStatus, 'error' | 'warning' | 'success'> = {
  missing: 'error',
  draft: 'warning',
  published: 'success',
};

// Chữ cảnh báo: màu đậm trên nền sáng, màu nhạt trên nền tối để vẫn đọc được.
const warningText = (theme: Theme) =>
  theme.palette.mode === 'light' ? theme.palette.warning.dark : theme.palette.warning.light;

type Props = {
  row: StudyReportViewRow;
  // Điện thoại: gộp thành 2 ô (thông tin + nút nhập) để không phải cuộn ngang mới bấm được.
  compact: boolean;
  attentionDrop: number;
  onEnter: (row: StudyReportViewRow) => void;
  onViewProfile: (id: string) => void;
  // Chọn nhiều dòng để công khai / thu hồi — chỉ dòng đã có báo cáo mới chọn được.
  selected: boolean;
  onSelectRow: (id: string) => void;
};

export default function StudyReportTableRow({
  row,
  compact,
  attentionDrop,
  onEnter,
  onViewProfile,
  selected,
  onSelectRow,
}: Props) {
  const { t } = useLocales();

  const { name, namejp, avatar, company, tradeUnion, report, reportStatus, total, delta } = row;

  const enterLabel = report ? t('study_report_edit') : t('study_report_enter');

  const enterIcon = report ? 'solar:pen-bold' : 'mingcute:add-line';

  const newIntern =
    row.isNew && row.studyDate
      ? t('study_report_new_intern', { date: fDate(row.studyDate, 'dd/MM') })
      : '';

  // Vd "Tụt 73 điểm", "Chuyên cần 60" — để giáo viên biết ngay vì sao dòng này cần chú ý.
  const reasonTexts = row.reasons.map((reason) => {
    if (reason === 'drop') return t('study_attention_reason_drop', { points: -(delta ?? 0) });
    if (reason === 'attend') return t('study_attention_reason_attend', { value: report?.attend });
    return t('study_attention_reason_missing2');
  });

  // Bấm tên để mở hồ sơ (tab mới). Tên dài bị cắt "..." nên tooltip hiện tên đầy đủ.
  const nameLink = (
    <Tooltip title={name} placement="top-start" arrow>
      <Link
        component="button"
        type="button"
        color="inherit"
        underline="hover"
        aria-label={`${t('study_report_view_profile')}: ${name}`}
        onClick={() => onViewProfile(row._id)}
        sx={{
          display: 'block',
          maxWidth: 1,
          overflow: 'hidden',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          typography: 'body2',
        }}
      >
        {name}
      </Link>
    </Tooltip>
  );

  // Đã công khai = đang khóa sửa (xem studyLock bên BE): hiện ổ khóa để người nhập biết.
  const statusLabel = (
    <Tooltip title={reportStatus === 'published' ? t('study_lock_hint') : ''} arrow>
      <Label
        variant="soft"
        color={STATUS_COLOR[reportStatus]}
        startIcon={
          reportStatus === 'published' ? (
            <Iconify icon="solar:lock-keyhole-minimalistic-bold" />
          ) : null
        }
      >
        {t(`study_report_status_${reportStatus}`)}
      </Label>
    </Tooltip>
  );

  const selectCell = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        disabled={!report}
        onClick={() => onSelectRow(row._id)}
        inputProps={{ 'aria-label': `${t('study_publish_select')}: ${name}` }}
      />
    </TableCell>
  );

  const renderChange = () => {
    if (delta === null) {
      return (
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          —
        </Typography>
      );
    }

    const color = (delta > 0 && 'success.main') || (delta < 0 && 'error.main') || 'text.secondary';

    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="subtitle2" sx={{ color, whiteSpace: 'nowrap' }}>
          {delta > 0 ? `+${delta}` : delta}
        </Typography>
        {row.reasons.includes('drop') && (
          <Tooltip title={t('study_report_attention_hint', { points: attentionDrop })} arrow>
            <Iconify icon="solar:danger-triangle-bold" width={18} sx={{ color: 'warning.main' }} />
          </Tooltip>
        )}
      </Stack>
    );
  };

  if (compact) {
    return (
      <TableRow hover selected={selected}>
        {selectCell}
        {/* width 100% + maxWidth 0: ô co theo màn hình, tên dài cắt "..." thay vì đẩy bảng rộng ra. */}
        <TableCell sx={{ width: 1, maxWidth: 0, pr: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar alt={name} src={avatar} />
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              {nameLink}
              <Stack direction="row" alignItems="center" flexWrap="wrap" columnGap={1} rowGap={0.5}>
                {statusLabel}
                {total !== null && <Typography variant="subtitle2">{total}</Typography>}
                {delta !== null && renderChange()}
                {newIntern && (
                  <Typography variant="caption" sx={{ color: 'info.main' }}>
                    {newIntern}
                  </Typography>
                )}
              </Stack>
              {reasonTexts.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: warningText, fontWeight: 600, whiteSpace: 'pre-line' }}
                >
                  {reasonTexts.join('\n')}
                </Typography>
              )}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell align="right" sx={{ pl: 0, pr: 1.5 }}>
          <Tooltip title={enterLabel} arrow>
            <IconButton
              aria-label={enterLabel}
              color={report ? 'default' : 'primary'}
              onClick={() => onEnter(row)}
              sx={{
                p: 1.5,
                ...(!report && {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                }),
              }}
            >
              <Iconify icon={enterIcon} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover selected={selected}>
      {selectCell}
      {/* Tên dài không xuống dòng mà cắt "...": giới hạn bề rộng để bảng vừa màn hình laptop. */}
      <TableCell sx={{ maxWidth: 200 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatar} />
          <ListItemText
            primary={nameLink}
            // Ưu tiên lý do cần chú ý > TTS mới nhập học > tên tiếng Nhật.
            secondary={reasonTexts.join('\n') || newIntern || namejp}
            primaryTypographyProps={{ component: 'div' }}
            secondaryTypographyProps={{
              component: 'span',
              // Mỗi lý do một dòng, không cắt "...": không phải rê chuột mới đọc được (tiếng Nhật
              // không có dấu cách nên nối chung một dòng sẽ bị ngắt giữa chữ).
              noWrap: !reasonTexts.length,
              sx: reasonTexts.length
                ? { color: warningText, fontWeight: 600, whiteSpace: 'pre-line' }
                : { color: newIntern ? 'info.main' : 'text.disabled' },
            }}
            sx={{ minWidth: 0 }}
          />
        </Stack>
      </TableCell>

      <TableCell sx={{ maxWidth: 185 }}>
        <ListItemText
          primary={company || '—'}
          secondary={tradeUnion}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ component: 'span', noWrap: true, color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell
        sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {(report?.teacher && <Box component="span">{report.teacher}</Box>) ||
          (row.teacherName && (
            <Tooltip title={t('study_report_last_teacher')} arrow>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.teacherName}
              </Box>
            </Tooltip>
          )) || (
            <Box component="span" sx={{ color: 'text.disabled' }}>
              —
            </Box>
          )}
      </TableCell>

      <TableCell>
        <Stack spacing={0.5} alignItems="flex-start">
          {statusLabel}
          {report?.updatedAt && (
            <Typography variant="caption" sx={{ color: 'text.disabled', whiteSpace: 'nowrap' }}>
              {t('study_report_updated_at', { date: fDate(report.updatedAt, 'dd/MM/yyyy') })}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {total === null ? (
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            —
          </Typography>
        ) : (
          <Typography variant="subtitle2">{total}</Typography>
        )}
      </TableCell>

      <TableCell>{renderChange()}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Button
          size="small"
          variant={report ? 'outlined' : 'contained'}
          color={report ? 'inherit' : 'primary'}
          startIcon={<Iconify icon={enterIcon} />}
          onClick={() => onEnter(row)}
        >
          {enterLabel}
        </Button>
      </TableCell>
    </TableRow>
  );
}
