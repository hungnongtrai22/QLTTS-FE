// types
import { IInternItem } from 'src/types/user';
// utils
import { evaluateStudent } from 'src/utils/studyGrade';
//
import {
  LESSON_MAX,
  LESSON_N5,
  LessonProgressIntern,
  lessonForecast,
} from '../overview/app/lesson-progress-utils';

// ----------------------------------------------------------------------
// Cột học tập ở danh sách TTS của nghiệp đoàn ("組合経由の実習生"). Dữ liệu từ
// POST /api/study/listPartnerSummary — CHỈ báo cáo đã công khai, đúng những gì đối tác được xem.
// Tốc độ học / dự kiến bài lúc bay dùng chung lessonForecast với trang tổng quan.
// ----------------------------------------------------------------------

export type PartnerStudySummary = {
  _id: string;
  latest: {
    month: string; // YYYY-MM
    total: number;
    discipline: number;
    attitude: number;
    health: number;
    cooperation: number;
    attend: number;
    updatedAt: string;
  };
  prev: { month: string; total: number } | null;
  lesson: number | null;
  review: boolean;
  lessonMonth: string | null;
};

export type PartnerStudyResponse = {
  // Tháng mới nhất có báo cáo công khai trong phạm vi tài khoản, và lần cập nhật gần nhất của tháng đó
  month: string | null;
  updatedAt: string | null;
  interns: PartnerStudySummary[];
};

// Giảm từ chừng này điểm trở lên là "giảm mạnh" — cùng ngưỡng "Cần chú ý" (ATTENTION_DROP)
// ở trang Báo cáo học tập.
export const PARTNER_BIG_DROP = 50;

// "Mới": báo cáo của tháng mới nhất, cập nhật trong chừng này ngày. Hệ thống chưa ghi ai đã xem
// báo cáo nên tạm tính theo ngày cập nhật (công khai cũng cập nhật updatedAt).
export const PARTNER_NEW_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

// current: báo cáo của tháng mới nhất · pending: TTS đang học mà tháng mới nhất chưa công khai ·
// old: TTS không còn học (đã xuất cảnh…), hiện báo cáo cuối · none: chưa có báo cáo công khai
export type PartnerScoreState = 'current' | 'pending' | 'old' | 'none';

export type PartnerStudyView = {
  scoreState: PartnerScoreState;
  month: string | null; // YYYY-MM của báo cáo đang hiện
  total: number | null;
  grade: string | null; // 秀 / 優 / 良 / 可 / 不可
  delta: number | null; // so với báo cáo công khai liền trước
  deltaVsLastMonth: boolean; // báo cáo liền trước đúng là tháng trước
  bigDrop: boolean;
  isNew: boolean;
  lesson: number | null; // 0 = nhập môn
  review: boolean;
  lessonPct: number; // 0–100 trên thang LESSON_MAX bài
  pace: number | null; // bài / tháng
  slow: boolean;
  // Chỉ TTS đang học mới có dự kiến lúc bay
  forecast: 'ok' | 'behind' | 'later' | null;
  projected: number | null;
};

export type PartnerInternRow = IInternItem & {
  study: PartnerStudyView;
  // Khoá sắp xếp (TableHeadCustom sắp theo tên trường): chưa có thì -1
  studyTotal: number;
  studyLesson: number;
  companyName: string;
};

export const N5_PCT = (LESSON_N5 / LESSON_MAX) * 100;

const monthIndex = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return year * 12 + month;
};

export function buildStudyView(
  intern: IInternItem,
  summary: PartnerStudySummary | undefined,
  currentMonth: string | null,
  now = Date.now()
): PartnerStudyView {
  const studying = intern.status === 'study';
  const lesson = summary?.lesson ?? null;

  let scoreState: PartnerScoreState = 'none';
  if (summary) {
    if (summary.latest.month === currentMonth) scoreState = 'current';
    else scoreState = studying ? 'pending' : 'old';
  }

  const latest = summary?.latest;
  const delta = latest && summary?.prev ? latest.total - summary.prev.total : null;

  const forecastInput: LessonProgressIntern = {
    _id: intern._id,
    name: intern.name,
    namejp: intern.namejp,
    avatar: intern.avatar,
    tradeUnion: '',
    company: '',
    source: '',
    lesson,
    review: !!summary?.review,
    month: latest?.month ?? null,
    lessonMonth: summary?.lessonMonth ?? null,
    studyDate: (intern.studyDate as any) || null,
    startDate: (intern.startDate as any) || null,
  };
  const forecast = lessonForecast(forecastInput, now);

  let forecastState: PartnerStudyView['forecast'] = null;
  if (studying && lesson !== null && intern.startDate) {
    if (forecast.projected === null) forecastState = 'later';
    else forecastState = forecast.behind ? 'behind' : 'ok';
  }

  return {
    scoreState,
    month: latest?.month ?? null,
    total: latest?.total ?? null,
    grade: latest
      ? evaluateStudent(
          latest.discipline,
          latest.attitude,
          latest.health,
          latest.cooperation,
          latest.attend,
          Number(latest.total) || 0
        )
      : null,
    delta,
    deltaVsLastMonth:
      !!latest &&
      !!summary?.prev &&
      monthIndex(latest.month) - monthIndex(summary.prev.month) === 1,
    bigDrop: delta !== null && delta <= -PARTNER_BIG_DROP,
    isNew:
      scoreState === 'current' &&
      !!latest &&
      now - new Date(latest.updatedAt).getTime() <= PARTNER_NEW_DAYS * DAY_MS,
    lesson,
    review: !!summary?.review,
    lessonPct: lesson === null ? 0 : Math.max(2, Math.min(100, (lesson / LESSON_MAX) * 100)),
    pace: forecast.pace,
    slow: forecast.slow,
    forecast: forecastState,
    projected: forecast.projected,
  };
}

export function buildPartnerRows(
  interns: IInternItem[],
  data: PartnerStudyResponse | null,
  now = Date.now()
): PartnerInternRow[] {
  const byId = new Map((data?.interns || []).map((item) => [item._id, item]));
  return interns.map((intern) => {
    const study = buildStudyView(intern, byId.get(String(intern._id)), data?.month ?? null, now);
    return {
      ...intern,
      study,
      studyTotal: study.total ?? -1,
      studyLesson: study.lesson ?? -1,
      companyName: intern.companySelect?.name || '',
    };
  });
}

// "YYYY-MM" → { year, month } (số)
export const splitMonth = (key: string | null) => {
  if (!key) return null;
  const [year, month] = key.split('-').map(Number);
  return { year, month };
};

// Tháng của một ngày ISO theo giờ VN, kiểu từng ngôn ngữ: "2026年5月" / "5/2026".
export const monthLabel = (iso: unknown, lang: string) => {
  if (!iso) return '';
  const date = new Date(new Date(iso as string).getTime() + 7 * 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return lang === 'jp' ? `${year}年${month}月` : `${month}/${year}`;
};
