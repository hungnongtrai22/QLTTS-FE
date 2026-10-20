import { useMemo } from 'react';
// @mui
import { alpha, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import {
  LESSON_STAGES,
  LessonStage,
  LessonStats,
  LessonProgressIntern,
  groupLessonProgress,
  lessonStats,
} from './lesson-progress-utils';
import { useLessonLabels } from './use-lesson-labels';

// ----------------------------------------------------------------------
// Thẻ "Phân bố theo mốc giáo trình": mỗi nghiệp đoàn một thanh xếp chồng — bao nhiêu TTS đang
// ở nhập môn / bài 1–10 / bài 11–25 (N5) / bài 26–50 (N4) / chưa có báo cáo.
// Màu là một dải đậm dần của primary: học càng xa màu càng đậm.
// ----------------------------------------------------------------------

const stageColor = (theme: Theme, stage: LessonStage) =>
  ({
    intro: { bg: theme.palette.primary.lighter, text: theme.palette.primary.darker },
    basic: { bg: theme.palette.primary.light, text: theme.palette.primary.darker },
    n5: { bg: theme.palette.primary.main, text: theme.palette.primary.contrastText },
    n4: { bg: theme.palette.primary.darker, text: theme.palette.primary.contrastText },
    none: { bg: alpha(theme.palette.grey[500], 0.24), text: theme.palette.text.secondary },
  }[stage]);

// Đoạn hẹp hơn mức này thì không ghi số (vẫn xem được qua chú thích và title).
const MIN_LABEL_SHARE = 0.08;

function StageBar({
  stats,
  labelOf,
}: {
  stats: LessonStats;
  labelOf: (stage: LessonStage) => string;
}) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{ height: 20, borderRadius: 1, overflow: 'hidden', bgcolor: 'background.neutral' }}
    >
      {LESSON_STAGES.filter((stage) => stats.stages[stage] > 0).map((stage) => {
        const count = stats.stages[stage];
        const color = stageColor(theme, stage);
        return (
          <Box
            key={stage}
            title={`${labelOf(stage)}: ${count}`}
            sx={{
              flexGrow: count,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color.bg,
              color: color.text,
              typography: 'caption',
              fontWeight: 'fontWeightSemiBold',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {count / stats.count >= MIN_LABEL_SHARE ? count : ''}
          </Box>
        );
      })}
    </Stack>
  );
}

type Props = {
  // undefined = đang tải
  interns?: LessonProgressIntern[];
};

export default function AppLessonStages({ interns }: Props) {
  const theme = useTheme();

  const labels = useLessonLabels();

  const groups = useMemo(() => groupLessonProgress(interns || []), [interns]);

  const overall = useMemo(() => lessonStats(interns || []), [interns]);

  const rows = [
    { key: '__all', name: labels.text('dashboard_lesson_all'), stats: overall, strong: true },
    ...groups.map((union) => ({
      key: union.key,
      name: labels.union(union.name),
      stats: union.stats,
      strong: false,
    })),
  ];

  const renderBody = () => {
    if (!interns) {
      return [...Array(5)].map((_, index) => (
        <Box key={index}>
          <Skeleton variant="text" sx={{ width: 0.6 }} />
          <Skeleton variant="rounded" height={20} />
        </Box>
      ));
    }

    if (!interns.length) {
      return <EmptyContent title={labels.text('dashboard_lesson_empty')} sx={{ py: 6 }} />;
    }

    return rows.map((row) => (
      <Box key={row.key} sx={{ ...(row.strong && { pb: 1 }) }}>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.75 }}>
          <Typography
            variant={row.strong ? 'subtitle2' : 'body2'}
            noWrap
            title={row.name}
            sx={{ flexGrow: 1, minWidth: 0 }}
          >
            {row.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
            {labels.text('dashboard_lesson_count', { count: row.stats.count })}
          </Typography>
        </Stack>
        <StageBar stats={row.stats} labelOf={labels.stage} />
      </Box>
    ));
  };

  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: 1 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.25,
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Iconify icon="solar:chart-square-bold-duotone" width={22} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6">{labels.text('dashboard_lesson_stages_title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {labels.text('dashboard_lesson_stages_subheader')}
          </Typography>
        </Box>
      </Stack>

      {/* Chú thích kèm tổng số TTS ở từng mốc */}
      <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={0.75} sx={{ mb: 2.5 }}>
        {LESSON_STAGES.map((stage) => (
          <Stack
            key={stage}
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ opacity: !interns || overall.stages[stage] ? 1 : 0.48 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                flexShrink: 0,
                borderRadius: 0.5,
                bgcolor: stageColor(theme, stage).bg,
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {labels.stage(stage)}
            </Typography>
            {interns && <Typography variant="subtitle2">{overall.stages[stage]}</Typography>}
          </Stack>
        ))}
      </Stack>

      <Stack spacing={2}>{renderBody()}</Stack>
    </Card>
  );
}
