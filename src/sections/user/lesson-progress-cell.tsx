// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//
import { N5_PCT, LessonProgressView } from './partner-study-utils';
import usePartnerStudyLabels from './use-partner-study-labels';

// ----------------------------------------------------------------------
// Ô "Tiến độ học": bài đang học, tốc độ (bài / tháng), thanh 0–50 bài có vạch N5 (bài 25), ngày
// nhập học. Dùng chung cho danh sách TTS của nghiệp đoàn và trang Báo cáo học tập của admin.
// ----------------------------------------------------------------------

export function LessonBar({ pct, slow }: { pct: number; slow: boolean }) {
  return (
    <Box aria-hidden sx={{ position: 'relative', height: 6, borderRadius: 3, bgcolor: 'grey.300' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: `${pct}%`,
          borderRadius: 3,
          bgcolor: slow ? 'warning.main' : 'primary.main',
        }}
      />
      {/* Vạch N5 (hết bài 25) */}
      <Box
        sx={{
          position: 'absolute',
          left: `${N5_PCT}%`,
          top: -3,
          width: 2,
          height: 12,
          bgcolor: 'text.secondary',
        }}
      />
    </Box>
  );
}

type Props = {
  study: LessonProgressView;
  studyDate?: unknown;
};

export default function LessonProgressCell({ study, studyDate }: Props) {
  const { t, lessonText, paceText, month } = usePartnerStudyLabels();

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {lessonText(study)}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: study.slow ? 'warning.dark' : 'text.secondary', whiteSpace: 'nowrap' }}
        >
          {paceText(study)}
        </Typography>
      </Stack>
      {study.lesson !== null && <LessonBar pct={study.lessonPct} slow={study.slow} />}
      {!!studyDate && (
        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {t('partner_study_date', { date: month(studyDate) })}
        </Typography>
      )}
    </Stack>
  );
}
