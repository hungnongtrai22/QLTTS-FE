import { Fragment, memo } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
//
import { PartnerInternRow } from './partner-study-utils';
import usePartnerStudyLabels, { PartnerTone } from './use-partner-study-labels';
import LessonProgressCell from './lesson-progress-cell';

// ----------------------------------------------------------------------
// Một dòng ở danh sách TTS của nghiệp đoàn, có cột học tập (điểm tháng mới nhất, tiến độ bài,
// dự kiến bài lúc sang Nhật). Bọc memo; handler nhận id — xem CLAUDE.md "Dòng bảng đã memo hoá".
// ----------------------------------------------------------------------

export const TONE_COLOR: Record<PartnerTone, string> = {
  up: 'success.dark',
  down: 'text.secondary',
  drop: 'error.dark',
  muted: 'text.secondary',
};

type Props = {
  row: PartnerInternRow;
  currentMonth: string | null;
  selected: boolean;
  onSelectRow: (id: string) => void;
  onViewRow: (id: string) => void;
};

function InternTradeUnionStudyRow({ row, currentMonth, selected, onSelectRow, onViewRow }: Props) {
  const { t, deltaInfo, scoreNote, forecastText, month } = usePartnerStudyLabels();
  const { study } = row;
  const delta = deltaInfo(study);
  const note = study.scoreState === 'current' ? null : scoreNote(study, currentMonth);
  const forecast = forecastText(study);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={() => onSelectRow(row._id)} />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={row.name} src={row.avatar} />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              {study.isNew && (
                <Label variant="soft" color="info">
                  {t('partner_new')}
                </Label>
              )}
            </Stack>
            {/* Chỉ ngắt dòng tại "・": tiếng Nhật không có dấu cách, để tự ngắt sẽ cắt giữa tên. */}
            <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'keep-all' }}>
              {[
                ...(row.namejp || '').split('・'),
                ...(row.age ? [t('partner_age', { age: row.age })] : []),
              ]
                .filter(Boolean)
                .map((part, index) => (
                  <Fragment key={index}>
                    {index > 0 && '・'}
                    <wbr />
                    {part}
                  </Fragment>
                ))}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>

      {/* Tên công ty có thể rất dài (株式会社…製造北海道): cho xuống dòng để cột 入国日 không bị
          đẩy ra ngoài khung ở màn hình 1440px. */}
      <TableCell sx={{ minWidth: 140, maxWidth: 200 }}>{row.companySelect?.name}</TableCell>

      <TableCell>
        {note ? (
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'keep-all' }}>
              {note.title}
            </Typography>
            {note.sub && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {note.sub}
              </Typography>
            )}
          </Stack>
        ) : (
          <Stack spacing={0.5}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h6" component="span">
                {study.total}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                / 1000
              </Typography>
              {study.grade && <Label variant="soft">{study.grade}</Label>}
            </Stack>
            {delta && (
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: TONE_COLOR[delta.tone], whiteSpace: 'nowrap' }}
              >
                {delta.text}
              </Typography>
            )}
          </Stack>
        )}
      </TableCell>

      <TableCell>
        <LessonProgressCell study={study} studyDate={row.studyDate} />
      </TableCell>

      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
            {month(row.startDate)}
          </Typography>
          {forecast && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                typography: 'caption',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color:
                  (study.forecast === 'ok' && 'success.dark') ||
                  (study.forecast === 'behind' && 'warning.dark') ||
                  'text.secondary',
              }}
            >
              {study.forecast === 'ok' && <Iconify icon="eva:checkmark-fill" width={16} />}
              {study.forecast === 'behind' && <Iconify icon="eva:alert-triangle-fill" width={16} />}
              <span>{forecast}</span>
            </Stack>
          )}
        </Stack>
      </TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <Tooltip title={t('partner_view')} placement="top" arrow>
          <IconButton
            aria-label={t('partner_view_profile', { name: row.name }) || ''}
            onClick={() => onViewRow(row._id)}
            sx={{ width: 44, height: 44 }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default memo(InternTradeUnionStudyRow);
