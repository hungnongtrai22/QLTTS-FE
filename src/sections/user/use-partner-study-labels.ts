import { useCallback } from 'react';
// locales
import { useLocales } from 'src/locales';
//
import { PartnerStudyView, monthLabel, splitMonth } from './partner-study-utils';

// ----------------------------------------------------------------------
// Chuỗi hiển thị của cột học tập — dùng chung cho dòng bảng (PC) và thẻ (điện thoại) ở trang
// TTS của nghiệp đoàn.
// ----------------------------------------------------------------------

export type PartnerTone = 'up' | 'down' | 'drop' | 'muted';

export default function usePartnerStudyLabels() {
  const { t, currentLang } = useLocales();
  const lang = currentLang.value;

  const lessonText = useCallback(
    (study: PartnerStudyView) => {
      if (study.lesson === null) return '—';
      const base =
        study.lesson === 0 ? t('partner_lesson_intro') : t('partner_lesson', { n: study.lesson });
      return study.review ? `${base}${t('partner_review')}` : base;
    },
    [t]
  );

  const paceText = useCallback(
    (study: PartnerStudyView) => {
      if (study.pace !== null) {
        const value = t('partner_pace', { value: study.pace.toFixed(1) });
        return study.slow ? `${value}${t('partner_pace_slow')}` : value;
      }
      return study.lesson !== null ? t('partner_pace_new') : '';
    },
    [t]
  );

  // Dòng so sánh với báo cáo liền trước
  const deltaInfo = useCallback(
    (study: PartnerStudyView): { text: string; tone: PartnerTone } | null => {
      if (study.delta === null) return null;
      const sign = study.delta > 0 ? `▲ +${study.delta}` : `▼ −${Math.abs(study.delta)}`;
      const value = study.delta === 0 ? '±0' : sign;
      const text = study.deltaVsLastMonth
        ? t('partner_delta_month', { value })
        : t('partner_delta_report', { value });
      if (study.bigDrop) return { text: `${text}・${t('partner_big_drop')}`, tone: 'drop' };
      if (study.delta > 0) return { text, tone: 'up' };
      return { text, tone: 'muted' };
    },
    [t]
  );

  // Ô điểm khi chưa có báo cáo của tháng mới nhất
  const scoreNote = useCallback(
    (study: PartnerStudyView, currentMonth: string | null) => {
      const current = splitMonth(currentMonth);
      const shown = splitMonth(study.month);
      if (study.scoreState === 'pending' && current && shown) {
        return {
          title: t('partner_pending', { month: current.month }),
          sub: t('partner_prev_score', { month: shown.month, total: study.total }),
        };
      }
      if (study.scoreState === 'old' && shown) {
        return {
          title: t('partner_last_report', { year: shown.year, month: shown.month }),
          sub: t('partner_points', { total: study.total }),
        };
      }
      return { title: t('partner_no_report'), sub: '' };
    },
    [t]
  );

  const forecastText = useCallback(
    (study: PartnerStudyView) => {
      // Chỉ TTS đang học mới có dự kiến (TTS đã sang Nhật thì số này vô nghĩa).
      if (!study.forecast) return '';
      if (study.forecast === 'later') return t('partner_forecast_later');
      if (study.projected === null) return '';
      if (study.forecast === 'behind') {
        return `${t('partner_forecast', { n: study.projected })}${t('partner_forecast_behind')}`;
      }
      return study.projected >= 50
        ? t('partner_forecast_full')
        : t('partner_forecast', { n: study.projected });
    },
    [t]
  );

  const scoreHeader = useCallback(
    (currentMonth: string | null) => {
      const current = splitMonth(currentMonth);
      return current
        ? t('partner_col_score', { month: current.month })
        : t('partner_col_score_latest');
    },
    [t]
  );

  const month = useCallback((iso: unknown) => monthLabel(iso, lang), [lang]);

  return { t, lang, lessonText, paceText, deltaInfo, scoreNote, forecastText, scoreHeader, month };
}
