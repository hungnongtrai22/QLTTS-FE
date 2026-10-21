import { memo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
//
import { PartnerInternRow } from './partner-study-utils';
import usePartnerStudyLabels from './use-partner-study-labels';
import { LessonBar, TONE_COLOR } from './intern-trade-union-study-row';

// ----------------------------------------------------------------------
// Bản điện thoại / tablet của một dòng: cả thẻ bấm được để mở hồ sơ, ô chọn (so sánh) ở góc.

type Props = {
  row: PartnerInternRow;
  currentMonth: string | null;
  scoreLabel: string;
  selected: boolean;
  onSelectRow: (id: string) => void;
  onViewRow: (id: string) => void;
};

function InternTradeUnionStudyCard({
  row,
  currentMonth,
  scoreLabel,
  selected,
  onSelectRow,
  onViewRow,
}: Props) {
  const { t, lessonText, deltaInfo, scoreNote, forecastText, month } = usePartnerStudyLabels();
  const { study } = row;
  const delta = deltaInfo(study);
  const note = study.scoreState === 'current' ? null : scoreNote(study, currentMonth);
  const forecast = forecastText(study);

  return (
    <Card sx={{ position: 'relative', ...(selected && { bgcolor: 'action.selected' }) }}>
      <Checkbox
        checked={selected}
        onClick={() => onSelectRow(row._id)}
        inputProps={{ 'aria-label': t('partner_select', { name: row.name }) || '' }}
        sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1, width: 44, height: 44 }}
      />

      <CardActionArea
        onClick={() => onViewRow(row._id)}
        aria-label={t('partner_view_profile', { name: row.name }) || ''}
        sx={{ p: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pr: 5 }}>
          <Avatar alt={row.name} src={row.avatar} />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              {study.isNew && (
                <Label variant="soft" color="info" sx={{ flexShrink: 0 }}>
                  {t('partner_new')}
                </Label>
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {row.companySelect?.name || row.namejp}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {scoreLabel}
            </Typography>
            {note ? (
              <>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {note.title}
                </Typography>
                {note.sub && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {note.sub}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Stack direction="row" alignItems="baseline" spacing={0.75}>
                  <Typography variant="h6" component="span">
                    {study.total}
                  </Typography>
                  {study.grade && <Label variant="soft">{study.grade}</Label>}
                </Stack>
                {delta && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: TONE_COLOR[delta.tone] }}
                  >
                    {delta.text}
                  </Typography>
                )}
              </>
            )}
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('partner_col_progress')}
            </Typography>
            <Typography variant="subtitle1">{lessonText(study)}</Typography>
            {study.lesson !== null && <LessonBar pct={study.lessonPct} slow={study.slow} />}
          </Stack>
        </Box>

        {(row.startDate || forecast) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 1.5, typography: 'caption' }}
          >
            <Box component="span" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {row.startDate ? `${t('date_import')} ${month(row.startDate)}` : ''}
            </Box>
            {forecast && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{
                  fontWeight: 600,
                  textAlign: 'right',
                  color:
                    (study.forecast === 'ok' && 'success.dark') ||
                    (study.forecast === 'behind' && 'warning.dark') ||
                    'text.secondary',
                }}
              >
                {study.forecast === 'ok' && <Iconify icon="eva:checkmark-fill" width={14} />}
                {study.forecast === 'behind' && (
                  <Iconify icon="eva:alert-triangle-fill" width={14} />
                )}
                <span>{forecast}</span>
              </Stack>
            )}
          </Stack>
        )}
      </CardActionArea>
    </Card>
  );
}

export default memo(InternTradeUnionStudyCard);
