import { memo, useMemo } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyBulkRow, IStudyScoreKey } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
//
import { BulkEntry, BulkFieldKey, LEVELS, SCORE_KEYS, rowState } from './study-bulk-utils';

// ----------------------------------------------------------------------

// Tổng điểm giảm từ mức này so với tháng trước thì hiện dấu cảnh báo (cùng ngưỡng với trang
// Báo cáo học tập).
export const ATTENTION_DROP = 50;

// Ô điểm dạng bảng tính. Trạng thái qua data-state để một style dùng cho cả bảng.
export const ScoreInput = styled('input')(({ theme }) => ({
  width: 42,
  height: 36,
  boxSizing: 'border-box',
  padding: theme.spacing(0, 0.25),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontFamily: 'inherit',
  fontSize: theme.typography.body2.fontSize,
  outline: 'none',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
  },
  '&[data-state="suggested"]': {
    borderStyle: 'dashed',
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  '&[data-state="edited"]': {
    borderColor: alpha(theme.palette.success.main, 0.56),
    backgroundColor: alpha(theme.palette.success.main, 0.08),
    fontWeight: theme.typography.fontWeightSemiBold,
  },
  '&[data-state="error"]': {
    borderColor: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.08),
    color: theme.palette.error.dark,
    fontWeight: theme.typography.fontWeightSemiBold,
  },
  // Báo cáo đã công khai, chưa mở khóa: chỉ xem.
  '&:disabled': {
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    color: theme.palette.text.secondary,
    fontStyle: 'normal',
    cursor: 'not-allowed',
  },
}));

type Props = {
  row: IStudyBulkRow;
  entry: BulkEntry;
  saveError?: string;
  rowIndex: number;
  locked: boolean;
  onUnlock: (id: string) => void;
  onScore: (id: string, key: IStudyScoreKey, raw: string) => void;
  onField: (id: string, key: BulkFieldKey, value: string | number | null) => void;
  onOpenDetail: (id: string) => void;
  onPasteBlock: (rowIndex: number, colIndex: number, text: string) => void;
  onNavigate: (rowIndex: number, colIndex: number, step: number) => void;
  registerInput: (rowIndex: number, colIndex: number, el: HTMLInputElement | null) => void;
  scoreLabels: string[];
};

function StudyBulkTableRow({
  row,
  entry,
  saveError,
  rowIndex,
  locked,
  onUnlock,
  onScore,
  onField,
  onOpenDetail,
  onPasteBlock,
  onNavigate,
  registerInput,
  scoreLabels,
}: Props) {
  const { t } = useLocales();

  const state = useMemo(
    () => rowState(row, entry, saveError, locked),
    [row, entry, saveError, locked]
  );

  const { values, origin } = entry;

  const { total } = state.check;

  const prevTotal = row.prev?.total ?? null;

  const delta = total !== null && prevTotal !== null ? total - prevTotal : null;

  const missingText = state.check.missingText.length > 0;

  return (
    <TableRow hover>
      <TableCell
        sx={{
          position: 'sticky',
          left: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
          maxWidth: 190,
          py: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar alt={row.name} src={row.avatar} sx={{ width: 36, height: 36 }} />
          <ListItemText
            primary={row.name}
            secondary={t('study_bulk_month_no', { count: row.report?.time ?? row.nextTime })}
            primaryTypographyProps={{
              typography: 'body2',
              fontWeight: 600,
              noWrap: true,
              title: row.name,
            }}
            secondaryTypographyProps={{ component: 'span', noWrap: true, color: 'text.disabled' }}
            sx={{ minWidth: 0 }}
          />
        </Stack>
      </TableCell>

      {SCORE_KEYS.map((key, colIndex) => {
        const error = state.check.errors[key];
        const suggested = origin[key] === 'suggested';
        let dataState: string | undefined;
        if (error) dataState = 'error';
        else if (origin[key] === 'edited') dataState = 'edited';
        else if (suggested) dataState = 'suggested';

        return (
          <TableCell key={key} align="center" sx={{ px: 0.5, py: 1 }}>
            <ScoreInput
              ref={(el) => registerInput(rowIndex, colIndex, el)}
              inputMode="numeric"
              autoComplete="off"
              disabled={locked}
              value={values[key] === null ? '' : String(values[key])}
              data-state={dataState}
              title={
                (error && t(error)) ||
                (suggested && t('study_bulk_suggested_value', { value: row.prev?.[key] })) ||
                undefined
              }
              aria-label={`${row.name} – ${scoreLabels[colIndex]}`}
              onChange={(event) => onScore(row._id, key, event.target.value)}
              onPaste={(event) => {
                const text = event.clipboardData.getData('text');
                // Một ô thì để trình duyệt dán như thường; khối nhiều ô thì rải ra bảng.
                if (/[\t\n]/.test(text.trim())) {
                  event.preventDefault();
                  onPasteBlock(rowIndex, colIndex, text);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  onNavigate(rowIndex, colIndex, 1);
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  onNavigate(rowIndex, colIndex, -1);
                }
              }}
            />
          </TableCell>
        );
      })}

      <TableCell align="center" sx={{ px: 1 }}>
        <Typography variant="subtitle2">{total ?? '—'}</Typography>
        {delta !== null && (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.25}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color:
                  (delta > 0 && 'success.dark') || (delta < 0 && 'error.dark') || 'text.secondary',
              }}
            >
              {delta > 0 ? `+${delta}` : delta}
            </Typography>
            {delta <= -ATTENTION_DROP && (
              <Tooltip title={t('study_report_attention_hint', { points: ATTENTION_DROP })} arrow>
                <Iconify
                  icon="solar:danger-triangle-bold"
                  width={14}
                  sx={{ color: 'warning.main' }}
                />
              </Tooltip>
            )}
          </Stack>
        )}
      </TableCell>

      <TableCell sx={{ px: 1 }}>
        <TextField
          select
          size="small"
          value={values.level}
          onChange={(event) => onField(row._id, 'level', event.target.value)}
          SelectProps={{ native: true }}
          disabled={locked}
          inputProps={{ 'aria-label': `${row.name} – ${t('study_bulk_col_level')}` }}
          sx={{
            width: 68,
            '& select': {
              py: 1,
              ...(origin.level === 'suggested' && { color: 'text.secondary', fontStyle: 'italic' }),
            },
          }}
        >
          <option value="" disabled>
            —
          </option>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </TextField>
      </TableCell>

      <TableCell align="center" sx={{ px: 0.5 }}>
        <Tooltip title={t('study_bulk_open_detail')} arrow>
          <IconButton
            aria-label={`${t('study_bulk_open_detail')} – ${row.name}`}
            onClick={() => onOpenDetail(row._id)}
            sx={{ position: 'relative' }}
          >
            <Iconify icon="solar:chat-round-dots-bold" />
            {missingText && (
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell sx={{ pl: 1, whiteSpace: 'nowrap' }}>
        <Stack direction="row" alignItems="center" spacing={0.25}>
          {/* Ổ khóa là nút "Mở khóa để sửa" luôn — gộp lại cho cột vừa laptop. */}
          {locked && (
            <Tooltip title={`${t('study_lock_hint')} · ${t('study_unlock')}`} arrow>
              <IconButton
                size="small"
                aria-label={`${t('study_unlock')} – ${row.name}`}
                onClick={() => onUnlock(row._id)}
                sx={{ color: 'success.dark', ml: -0.5 }}
              >
                <Iconify icon="solar:lock-keyhole-minimalistic-bold" width={18} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={saveError || ''} arrow>
            <Label variant="soft" color={state.status.tone}>
              {t(state.status.key, { ...state.status.params })}
            </Label>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

// memo: gõ vào một ô chỉ vẽ lại đúng dòng đó. Có tác dụng vì `entry` của các dòng khác giữ
// nguyên đối tượng và mọi handler từ view đều ổn định (useCallback, cập nhật state dạng hàm).
export default memo(StudyBulkTableRow);
