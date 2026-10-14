import { useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyBulkRow, IStudyScoreKey } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import { ScoreInput } from './study-bulk-table-row';
import {
  BulkEntry,
  BulkFieldKey,
  BulkTextKey,
  LEVELS,
  SCORE_KEYS,
  rowState,
} from './study-bulk-utils';

// ----------------------------------------------------------------------

type Props = {
  rows: IStudyBulkRow[];
  work: Record<string, BulkEntry>;
  saveErrors: Record<string, string>;
  index: number;
  onIndex: (index: number) => void;
  scoreLabels: string[];
  saving: boolean;
  publishNow: boolean;
  onPublishNow: (value: boolean) => void;
  onScore: (id: string, key: IStudyScoreKey, raw: string) => void;
  onField: (id: string, key: BulkFieldKey, value: string | number | null) => void;
  onOpenDetail: (id: string) => void;
  onSaveOne: (id: string) => Promise<boolean>;
};

// Điện thoại: từng TTS một, mỗi điểm có nút − / + to dễ bấm (Đọc hiểu bước 10, còn lại bước 5).
export default function StudyBulkMobile({
  rows,
  work,
  saveErrors,
  index,
  onIndex,
  scoreLabels,
  saving,
  publishNow,
  onPublishNow,
  onScore,
  onField,
  onOpenDetail,
  onSaveOne,
}: Props) {
  const { t } = useLocales();

  const current = rows[Math.min(index, rows.length - 1)];
  const entry = current ? work[current._id] : undefined;

  const state = useMemo(
    () => (current && entry ? rowState(current, entry, saveErrors[current._id]) : null),
    [current, entry, saveErrors]
  );

  if (!current || !entry || !state) {
    return <EmptyContent filled title={t('study_bulk_empty') || ''} sx={{ m: 2.5, py: 10 }} />;
  }

  const position = Math.min(index, rows.length - 1);
  const isLast = position >= rows.length - 1;
  const { values, origin } = entry;
  const { total } = state.check;
  const prevTotal = current.prev?.total ?? null;
  const delta = total !== null && prevTotal !== null ? total - prevTotal : null;

  const fieldLabel: Record<BulkTextKey, string> = {
    level: t('level'),
    learningProcess: t('learningProcess'),
    characteristic: t('characteristic'),
    teacher: t('teacher'),
    comment: t('study_bulk_comment'),
  };

  const step = (key: IStudyScoreKey, direction: number) => {
    const size = key === 'read' ? 10 : 5;
    const base = values[key] ?? current.prev?.[key] ?? 0;
    onField(current._id, key, Math.max(0, Math.min(100, base + direction * size)));
  };

  const goNext = async () => {
    if (state.savable) {
      const ok = await onSaveOne(current._id);
      if (!ok) return;
    }
    if (!isLast) onIndex(position + 1);
  };

  const renderScore = (key: IStudyScoreKey) => {
    const colIndex = SCORE_KEYS.indexOf(key);
    const label = scoreLabels[colIndex];
    const error = state.check.errors[key];
    let dataState: string | undefined;
    if (error) dataState = 'error';
    else if (origin[key] === 'edited') dataState = 'edited';
    else if (origin[key] === 'suggested') dataState = 'suggested';

    return (
      <Stack
        key={key}
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ py: 0.75, borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }}
      >
        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {label}
          </Typography>
          <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.disabled' }}>
            {error ? t(error) : t('study_bulk_prev_value', { value: current.prev?.[key] ?? '—' })}
          </Typography>
        </Stack>
        <IconButton
          aria-label={t('study_bulk_decrease', { label }) || ''}
          onClick={() => step(key, -1)}
          sx={{ width: 44, height: 44, border: (theme) => `solid 1px ${theme.palette.divider}` }}
        >
          <Iconify icon="eva:minus-fill" />
        </IconButton>
        <ScoreInput
          inputMode="numeric"
          autoComplete="off"
          aria-label={label}
          data-state={dataState}
          value={values[key] === null ? '' : String(values[key])}
          onChange={(event) => onScore(current._id, key, event.target.value)}
          sx={{ width: 56, height: 44, fontSize: 16 }}
        />
        <IconButton
          aria-label={t('study_bulk_increase', { label }) || ''}
          onClick={() => step(key, 1)}
          sx={{ width: 44, height: 44, border: (theme) => `solid 1px ${theme.palette.divider}` }}
        >
          <Iconify icon="eva:plus-fill" />
        </IconButton>
      </Stack>
    );
  };

  return (
    <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar alt={current.name} src={current.avatar} sx={{ width: 44, height: 44 }} />
        <ListItemText
          primary={current.name}
          secondary={`${current.namejp} · ${t('study_bulk_month_no', {
            count: current.report?.time ?? current.nextTime,
          })}`}
          primaryTypographyProps={{ typography: 'subtitle1', noWrap: true }}
          secondaryTypographyProps={{ component: 'span', noWrap: true }}
          sx={{ minWidth: 0 }}
        />
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
          {position + 1}/{rows.length}
        </Typography>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Label variant="soft" color={state.status.tone}>
          {t(state.status.key, { ...state.status.params })}
        </Label>
        {prevTotal !== null && (
          <Label variant="soft">{t('study_bulk_prev_total', { total: prevTotal })}</Label>
        )}
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t('study_bulk_mobile_hint')}
      </Typography>

      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {t('study_bulk_group_b')}
        </Typography>
        {SCORE_KEYS.slice(0, 6).map(renderScore)}
        <Typography variant="overline" component="div" sx={{ color: 'text.secondary', mt: 2 }}>
          {t('study_bulk_group_c')}
        </Typography>
        {SCORE_KEYS.slice(6).map(renderScore)}
      </Box>

      <TextField
        select
        label={t('level')}
        value={values.level}
        onChange={(event) => onField(current._id, 'level', event.target.value)}
        SelectProps={{ native: true }}
        helperText={origin.level === 'suggested' ? t('study_bulk_prefilled') : undefined}
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

      <Button
        variant="outlined"
        color={state.check.missingText.length ? 'warning' : 'inherit'}
        startIcon={<Iconify icon="solar:chat-round-dots-bold" />}
        onClick={() => onOpenDetail(current._id)}
        sx={{ minHeight: 48, justifyContent: 'flex-start' }}
      >
        {t('study_bulk_open_detail')}
      </Button>

      {state.dirty && !state.check.complete && state.check.missingText.length > 0 && (
        <Alert severity="warning">
          {t('study_bulk_missing', {
            fields: state.check.missingText.map((key) => fieldLabel[key]).join(', '),
          })}
        </Alert>
      )}

      <Stack
        spacing={1.5}
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          mx: -2,
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">
            {t('study_report_col_total')}: <strong>{total ?? '—'}</strong>
            {delta !== null && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  color:
                    (delta > 0 && 'success.dark') ||
                    (delta < 0 && 'error.dark') ||
                    'text.secondary',
                }}
              >
                {delta > 0 ? `+${delta}` : delta}
              </Box>
            )}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={publishNow}
                onChange={(event) => onPublishNow(event.target.checked)}
              />
            }
            label={t('study_bulk_publish_short')}
            sx={{ mr: 0 }}
          />
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <IconButton
            aria-label={t('study_bulk_prev_person') || ''}
            disabled={position === 0}
            onClick={() => onIndex(position - 1)}
            sx={{ width: 48, height: 48, border: (theme) => `solid 1px ${theme.palette.divider}` }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <LoadingButton
            fullWidth
            variant="contained"
            loading={saving}
            disabled={isLast && !state.savable}
            onClick={goNext}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            sx={{ minHeight: 48 }}
          >
            {state.savable ? t('study_bulk_save_next') : t('study_bulk_next_person')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
