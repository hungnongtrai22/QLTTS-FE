import { useMemo } from 'react';
// locales
import { useLocales } from 'src/locales';
//
import { LessonStage } from './lesson-progress-utils';

// ----------------------------------------------------------------------
// Nhãn hiển thị cho tiến độ bài học (vi: "Bài 8–25", jp: "第8〜25課"). Bài 0 là nhập môn (入門).
// ----------------------------------------------------------------------

export function useLessonLabels() {
  const { t } = useLocales();

  return useMemo(() => {
    const text = (key: string, options?: Record<string, unknown>) => t(key, { ...options }) || '';

    const lesson = (value: number) =>
      value === 0
        ? text('dashboard_lesson_intro')
        : text('dashboard_lesson_one', { lesson: value });

    const range = (min: number, max: number) => {
      if (min === max) return lesson(min);
      return min === 0
        ? text('dashboard_lesson_range_intro', { max })
        : text('dashboard_lesson_range', { min, max });
    };

    const median = (value: number) =>
      value === 0
        ? text('dashboard_lesson_median_intro')
        : text('dashboard_lesson_median', { lesson: value });

    // "2026-09" → "9/2026" (vi) / "2026年9月" (jp)
    const month = (key: string) => {
      const [year, monthNo] = key.split('-');
      return text('dashboard_lesson_month', { month: Number(monthNo), year });
    };

    return {
      text,
      lesson,
      range,
      median,
      month,
      months: (keys: string[]) => keys.map(month).join(' – '),
      union: (name: string) => name || text('dashboard_lesson_no_union'),
      company: (name: string) => name || text('dashboard_lesson_no_company'),
      stage: (stage: LessonStage) => text(`dashboard_lesson_stage_${stage}`),
    };
  }, [t]);
}
