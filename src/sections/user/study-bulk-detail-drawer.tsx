import { useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
// locales
import { useLocales } from 'src/locales';
// utils
import { learningProcess as LESSONS } from 'src/utils/learningProcess';
import { characteristicList } from 'src/utils/characteristic';
// types
import { IStudyBulkRow } from 'src/types/user';
// components
import Label from 'src/components/label';
import Editor from 'src/components/editor';
import Iconify from 'src/components/iconify';
//
import {
  COMMENT_MAX,
  JLPT_KEYS,
  LEVELS,
  BulkEntry,
  BulkFieldKey,
  BulkTextKey,
  commentText,
  parseScore,
  rowState,
} from './study-bulk-utils';

// ----------------------------------------------------------------------

type Props = {
  row: IStudyBulkRow | null;
  entry: BulkEntry | null;
  saveError?: string;
  monthLabel: string;
  teachers: string[];
  onField: (id: string, key: BulkFieldKey, value: string | number | null) => void;
  onClose: VoidFunction;
  // Không truyền = không có người trước / sau trong danh sách đang lọc
  onPrev?: VoidFunction;
  onNext?: VoidFunction;
};

// Số bài trong "皆の日本語第30課" — từ bài 26 trở đi thi thử theo đề N4 (cùng cách form nhập điểm ghi
// nhãn ô JLPT).
const lessonNumber = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

// Ô chữ cho phép chọn gợi ý hoặc gõ tự do (giống form nhập điểm).
function FreeTextField({
  label,
  value,
  options,
  suggested,
  error,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  suggested: boolean;
  error: boolean;
  onChange: (value: string) => void;
}) {
  const { t } = useLocales();

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={value}
      onInputChange={(event, next, reason) => {
        // "reset" với chuỗi rỗng là MUI tự dọn khi gắn component — không phải người dùng xóa.
        if (reason === 'reset' && !next) return;
        onChange(next);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={suggested ? t('study_bulk_prefilled') : ' '}
          sx={
            suggested ? { '& input': { fontStyle: 'italic', color: 'text.secondary' } } : undefined
          }
        />
      )}
    />
  );
}

export default function StudyBulkDetailDrawer({
  row,
  entry,
  saveError,
  monthLabel,
  teachers,
  onField,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const { t } = useLocales();

  const state = useMemo(
    () => (row && entry ? rowState(row, entry, saveError) : null),
    [row, entry, saveError]
  );

  const open = !!row && !!entry && !!state;

  const renderBody = () => {
    if (!row || !entry || !state) return null;

    const { values, origin } = entry;
    const { check } = state;
    const { total } = check;
    const prevTotal = row.prev?.total ?? null;
    const delta = total !== null && prevTotal !== null ? total - prevTotal : null;
    const jlptLevel = lessonNumber(values.learningProcess) > 25 ? 'N4' : 'N5';
    const commentLength = commentText(values.comment).length;
    const fieldLabel: Record<BulkTextKey, string> = {
      level: t('level'),
      learningProcess: t('learningProcess'),
      characteristic: t('characteristic'),
      teacher: t('teacher'),
      comment: t('study_bulk_comment'),
    };
    const missing = check.missingText.map((key) => fieldLabel[key]);
    const set = (key: BulkFieldKey) => (value: string | number | null) =>
      onField(row._id, key, value);

    return (
      <>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2, pr: 1 }}>
          <Avatar alt={row.name} src={row.avatar} sx={{ width: 44, height: 44 }} />
          <ListItemText
            primary={row.name}
            secondary={`${row.namejp} · ${monthLabel}`}
            primaryTypographyProps={{ typography: 'subtitle1', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', noWrap: true }}
            sx={{ minWidth: 0 }}
          />
          <IconButton
            aria-label={t('study_bulk_prev_person') || ''}
            onClick={onPrev}
            disabled={!onPrev}
            sx={{ p: 1.25 }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <IconButton
            aria-label={t('study_bulk_next_person') || ''}
            onClick={onNext}
            disabled={!onNext}
            sx={{ p: 1.25 }}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
          <IconButton aria-label={t('study_bulk_close') || ''} onClick={onClose} sx={{ p: 1.25 }}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 2, pb: 2 }}>
          <Label variant="soft">
            {t('study_report_col_total')}: {total ?? '—'}
          </Label>
          {delta !== null && (
            <Label
              variant="soft"
              color={(delta > 0 && 'success') || (delta < 0 && 'error') || 'default'}
            >
              {t('study_bulk_vs_prev', { value: delta > 0 ? `+${delta}` : delta })}
            </Label>
          )}
          <Label variant="soft" color={state.status.tone}>
            {t(state.status.key, { ...state.status.params })}
          </Label>
        </Stack>

        <Divider />

        <Stack spacing={2.5} sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
          {state.dirty && missing.length > 0 && (
            <Alert severity="warning">
              {t('study_bulk_missing', { fields: missing.join(', ') })}
            </Alert>
          )}
          {saveError && <Alert severity="error">{saveError}</Alert>}

          <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={2}>
            <TextField
              select
              label={t('level')}
              value={values.level}
              onChange={(event) => set('level')(event.target.value)}
              SelectProps={{ native: true }}
              error={state.dirty && check.missingText.includes('level')}
              helperText={origin.level === 'suggested' ? t('study_bulk_prefilled') : ' '}
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
            <TextField
              label={t('study_bulk_time_auto')}
              value={row.report?.time ?? row.nextTime}
              disabled
              helperText=" "
            />
          </Box>

          <FreeTextField
            label={t('learningProcess')}
            value={values.learningProcess}
            options={LESSONS}
            suggested={origin.learningProcess === 'suggested'}
            error={state.dirty && check.missingText.includes('learningProcess')}
            onChange={set('learningProcess')}
          />
          <FreeTextField
            label={t('characteristic')}
            value={values.characteristic}
            options={characteristicList}
            suggested={origin.characteristic === 'suggested'}
            error={state.dirty && check.missingText.includes('characteristic')}
            onChange={set('characteristic')}
          />
          <FreeTextField
            label={t('teacher')}
            value={values.teacher}
            options={teachers}
            suggested={origin.teacher === 'suggested'}
            error={false}
            onChange={set('teacher')}
          />

          <Stack spacing={1}>
            <Typography variant="subtitle2">
              {t('study_bulk_jlpt')}{' '}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {t('study_bulk_jlpt_note')}
              </Box>
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap={1.5}>
              {JLPT_KEYS.map((key) => (
                <TextField
                  key={key}
                  label={`${t(`study_bulk_jlpt_${key}`)} ${jlptLevel}`}
                  value={values[key] === null ? '' : String(values[key])}
                  onChange={(event) => set(key)(parseScore(event.target.value))}
                  error={!!check.errors[key]}
                  helperText={check.errors[key] ? t(check.errors[key] as string) : ' '}
                  inputProps={{ inputMode: 'numeric', style: { textAlign: 'center' } }}
                  InputLabelProps={{ shrink: true }}
                />
              ))}
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <Typography variant="subtitle2">{t('study_bulk_comment')}</Typography>
              <Typography
                variant="caption"
                sx={{ color: commentLength > COMMENT_MAX ? 'error.main' : 'text.secondary' }}
              >
                {commentLength}/{COMMENT_MAX}
              </Typography>
            </Stack>
            {!!row.prev?.comment && (
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:copy-bold" />}
                onClick={() => set('comment')(row.prev?.comment || '')}
                sx={{ alignSelf: 'flex-start', minHeight: 36 }}
              >
                {t('study_bulk_copy_prev_comment')}
              </Button>
            )}
            <Editor
              simple
              id="study-bulk-comment"
              key={row._id}
              value={values.comment}
              onChange={(html: string) => set('comment')(html)}
              error={
                !!check.errors.comment || (state.dirty && check.missingText.includes('comment'))
              }
              helperText={check.errors.comment ? t(check.errors.comment) : undefined}
            />
          </Stack>
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1.5} sx={{ p: 2 }}>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ minHeight: 44 }}>
            {t('study_bulk_done')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onNext}
            disabled={!onNext}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            sx={{ minHeight: 44 }}
          >
            {t('study_bulk_next_person')}
          </Button>
        </Stack>
      </>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 1, sm: 480 }, display: 'flex', flexDirection: 'column' } }}
    >
      {renderBody()}
    </Drawer>
  );
}
