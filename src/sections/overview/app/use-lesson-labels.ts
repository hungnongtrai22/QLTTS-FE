import { useMemo } from 'react';
// locales
import { useLocales } from 'src/locales';
// utils
import { DEFAULT_SOURCE_NAME } from 'src/utils/source';
//
import { LessonStage } from './lesson-progress-utils';

// ----------------------------------------------------------------------
// Nhãn hiển thị cho tiến độ bài học (vi: "Bài 8–25", jp: "第8〜25課"). Bài 0 là nhập môn (入門).
// ----------------------------------------------------------------------

export function useLessonLabels() {
  const { t, currentLang } = useLocales();

  const lang = currentLang.value;

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

    // 3,5 (vi) / 3.5 (jp)
    const decimal = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'ja-JP', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    const pace = (value: number) => text('dashboard_lesson_pace', { pace: decimal.format(value) });

    const paceSlow = (value: number) =>
      text('dashboard_lesson_pace_slow', { pace: decimal.format(value) });

    // Thời gian tới ngày bay tính từ hôm nay: "còn 3 tháng", "còn dưới 1 tháng", "đã quá ngày dự kiến"
    const untilDeparture = (months: number) => {
      if (months < 0) return text('dashboard_lesson_departure_passed');
      if (months < 1) return text('dashboard_lesson_departure_soon');
      return text('dashboard_lesson_months_left', { months: Math.round(months) });
    };

    return {
      text,
      pace,
      paceSlow,
      untilDeparture,
      lesson,
      range,
      median,
      month,
      months: (keys: string[]) => keys.map(month).join(' – '),
      union: (name: string) => name || text('dashboard_lesson_no_union'),
      company: (name: string) => name || text('dashboard_lesson_no_company'),
      // TTS chưa có nguồn thuộc "Nhật Tân" — cùng quy ước với danh sách TTS.
      source: (name: string) => name || DEFAULT_SOURCE_NAME,
      stage: (stage: LessonStage) => text(`dashboard_lesson_stage_${stage}`),
    };
  }, [t, lang]);
}
