// ----------------------------------------------------------------------
// Tiến độ bài học (giáo trình 皆の日本語) của TTS đang học — dữ liệu từ
// /api/user/dashboardStats → lessonProgress (xem QLTTS-BE/src/pages/api/user/lessonProgress.ts).
// Dùng chung cho thẻ "Tiến độ học theo nghiệp đoàn / công ty" và "Phân bố theo mốc giáo trình".
// ----------------------------------------------------------------------

export type LessonProgressIntern = {
  _id: string;
  name: string;
  namejp: string;
  avatar: string;
  tradeUnion: string;
  company: string;
  // Bài đang học theo báo cáo mới nhất (0 = nhập môn); null = chưa có báo cáo / không đọc được
  lesson: number | null;
  // Báo cáo mới nhất ghi "ôn tập" — lesson là bài của báo cáo trước đó
  review: boolean;
  // YYYY-MM của báo cáo mới nhất; null = chưa có báo cáo nào
  month: string | null;
  // YYYY-MM của báo cáo cho ra `lesson` (khác `month` khi báo cáo mới nhất là "ôn tập")
  lessonMonth: string | null;
  // Ngày nhập học / ngày xuất cảnh dự kiến (ISO)
  studyDate: string | null;
  startDate: string | null;
};

// Thang bài: hết bài 25 là xong N5, hết bài 50 là xong N4 (cùng mốc với form nhập điểm).
export const LESSON_MAX = 50;
export const LESSON_N5 = 25;

// Mốc giáo trình — thứ tự = thứ tự trên thanh phân bố.
export type LessonStage = 'intro' | 'basic' | 'n5' | 'n4' | 'none';

export const LESSON_STAGES: LessonStage[] = ['intro', 'basic', 'n5', 'n4', 'none'];

export const lessonStage = (lesson: number | null): LessonStage => {
  if (lesson === null) return 'none';
  if (lesson === 0) return 'intro';
  if (lesson <= 10) return 'basic';
  if (lesson <= LESSON_N5) return 'n5';
  return 'n4';
};

// ----------------------------------------------------------------------
// Ước tính tốc độ học và số bài lúc bay. Ngưỡng chọn theo dữ liệu thật:
// - Tốc độ = số bài ÷ số tháng từ ngày nhập học tới cuối tháng báo cáo. Trung vị 5,7 bài/tháng;
//   lịch sử các khóa: tháng 1 trung vị bài 3 (nhập môn), tháng 2 bài 10, tháng 6 bài 33.
// - Chỉ tính khi đã học từ PACE_MIN_MONTHS tháng: tháng đầu học nhập môn nên chậm hơn hẳn.
// - Học chậm: dưới PACE_SLOW bài/tháng (≈ 70% trung vị).
// - Dự kiến lúc bay = bài hiện tại + tốc độ riêng × số tháng còn lại tới ngày xuất cảnh dự kiến.
//   Mốc cần đạt lúc bay: hết bài 25 / N5 (chủ dự án chọn — mốc bài 50 thì chỉ 6/88 TTS kịp).
// ----------------------------------------------------------------------

export const PACE_SLOW = 4;
export const PACE_MIN_MONTHS = 2;
export const DEPARTURE_TARGET = LESSON_N5;

const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000;
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

// Thời điểm cuối tháng "YYYY-MM" (= 00:00 giờ VN ngày 1 tháng sau).
const monthEndVN = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return Date.UTC(year, month, 1) - VN_OFFSET_MS;
};

// "YYYY-MM" theo giờ VN của một ngày ISO.
const monthKeyVN = (iso: string) => {
  const date = new Date(new Date(iso).getTime() + VN_OFFSET_MS);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
};

export type LessonForecast = {
  // Bài/tháng; null = chưa rõ bài hoặc chưa học đủ PACE_MIN_MONTHS tháng
  pace: number | null;
  slow: boolean;
  // YYYY-MM xuất cảnh dự kiến (giờ VN)
  departure: string | null;
  // Số tháng từ hôm nay tới ngày xuất cảnh dự kiến (âm = đã quá ngày)
  monthsToDeparture: number | null;
  // Bài dự kiến lúc bay (làm tròn, tối đa LESSON_MAX); null = chưa ước tính được
  projected: number | null;
  // Dự kiến chưa tới DEPARTURE_TARGET lúc bay
  behind: boolean;
};

export function lessonForecast(intern: LessonProgressIntern, now = Date.now()): LessonForecast {
  const departureTime = intern.startDate ? new Date(intern.startDate).getTime() : null;
  const base = {
    departure: intern.startDate ? monthKeyVN(intern.startDate) : null,
    monthsToDeparture: departureTime === null ? null : (departureTime - now) / MONTH_MS,
  };

  if (intern.lesson === null || !intern.lessonMonth || !intern.studyDate) {
    return { ...base, pace: null, slow: false, projected: null, behind: false };
  }

  const asOf = monthEndVN(intern.lessonMonth);
  const monthsStudied = (asOf - new Date(intern.studyDate).getTime()) / MONTH_MS;
  const pace = monthsStudied >= PACE_MIN_MONTHS ? intern.lesson / monthsStudied : null;
  // Tính từ cuối tháng báo cáo (lúc có số bài), không phải từ hôm nay.
  const monthsLeft = departureTime === null ? null : Math.max(0, (departureTime - asOf) / MONTH_MS);
  const projected =
    pace !== null && monthsLeft !== null
      ? Math.min(LESSON_MAX, Math.round(intern.lesson + pace * monthsLeft))
      : null;

  return {
    ...base,
    pace,
    slow: pace !== null && pace < PACE_SLOW,
    projected,
    behind: projected !== null && projected < DEPARTURE_TARGET,
  };
}

// Cần theo dõi: học chậm, hoặc dự kiến chưa tới mốc lúc bay.
export const needsWatch = (forecast: LessonForecast) => forecast.slow || forecast.behind;

export type LessonWatchItem = { intern: LessonProgressIntern; forecast: LessonForecast };

// Danh sách cần theo dõi: ngày bay gần nhất lên đầu, cùng tháng thì dự kiến thấp hơn lên trước.
export function lessonWatchlist(interns: LessonProgressIntern[]): LessonWatchItem[] {
  return interns
    .map((intern) => ({ intern, forecast: lessonForecast(intern) }))
    .filter(({ forecast }) => needsWatch(forecast))
    .sort(
      (a, b) =>
        (a.forecast.monthsToDeparture ?? Infinity) - (b.forecast.monthsToDeparture ?? Infinity) ||
        (a.forecast.projected ?? Infinity) - (b.forecast.projected ?? Infinity)
    );
}

export type LessonStats = {
  count: number;
  // TTS chưa rõ bài: chưa có báo cáo nào, hoặc chỉ có báo cáo "ôn tập" không kèm số bài
  missing: number;
  min: number | null;
  max: number | null;
  median: number | null;
  stages: Record<LessonStage, number>;
  // Số TTS cần theo dõi (học chậm hoặc dự kiến chưa tới mốc lúc bay)
  watch: number;
};

export const lessonStats = (interns: LessonProgressIntern[]): LessonStats => {
  const lessons = interns
    .map((intern) => intern.lesson)
    .filter((lesson): lesson is number => lesson !== null)
    .sort((a, b) => a - b);
  const stages = { intro: 0, basic: 0, n5: 0, n4: 0, none: 0 };
  interns.forEach((intern) => {
    stages[lessonStage(intern.lesson)] += 1;
  });
  // Trung vị: số lẻ lấy giữa, số chẵn lấy bài thấp hơn trong hai bài giữa (luôn là số bài thật).
  const median = lessons.length ? lessons[Math.floor((lessons.length - 1) / 2)] : null;
  return {
    count: interns.length,
    missing: interns.length - lessons.length,
    min: lessons.length ? lessons[0] : null,
    max: lessons.length ? lessons[lessons.length - 1] : null,
    median,
    stages,
    watch: interns.filter((intern) => needsWatch(lessonForecast(intern))).length,
  };
};

export type LessonCompanyGroup = {
  key: string;
  name: string;
  stats: LessonStats;
  interns: LessonProgressIntern[];
};

export type LessonUnionGroup = {
  key: string;
  name: string;
  stats: LessonStats;
  companies: LessonCompanyGroup[];
};

// Bài cao trước; chưa có báo cáo xuống cuối; bằng nhau thì theo tên.
const byLessonDesc = (a: LessonProgressIntern, b: LessonProgressIntern) =>
  (b.lesson ?? -1) - (a.lesson ?? -1) || a.name.localeCompare(b.name, 'vi');

// Nghiệp đoàn → công ty → TTS; nhóm đông người lên trước. Tên trống giữ là '' để giao diện tự
// hiện "Chưa có nghiệp đoàn / công ty".
export function groupLessonProgress(interns: LessonProgressIntern[]): LessonUnionGroup[] {
  const unions = new Map<string, Map<string, LessonProgressIntern[]>>();
  interns.forEach((intern) => {
    const companies = unions.get(intern.tradeUnion) || new Map<string, LessonProgressIntern[]>();
    const list = companies.get(intern.company) || [];
    list.push(intern);
    companies.set(intern.company, list);
    unions.set(intern.tradeUnion, companies);
  });

  const bySize = (
    a: { name: string; stats: LessonStats },
    b: { name: string; stats: LessonStats }
  ) => b.stats.count - a.stats.count || a.name.localeCompare(b.name, 'ja');

  return Array.from(unions.entries())
    .map(([unionName, companies]) => {
      const companyGroups = Array.from(companies.entries())
        .map(([companyName, list]) => ({
          key: `${unionName}||${companyName}`,
          name: companyName,
          stats: lessonStats(list),
          interns: [...list].sort(byLessonDesc),
        }))
        .sort(bySize);
      return {
        key: unionName,
        name: unionName,
        stats: lessonStats(companyGroups.flatMap((company) => company.interns)),
        companies: companyGroups,
      };
    })
    .sort(bySize);
}

// Khoảng tháng của các báo cáo đang dùng, vd ['2026-09', '2026-10'].
export const reportMonthRange = (interns: LessonProgressIntern[]): string[] => {
  const months = Array.from(
    new Set(interns.map((intern) => intern.month).filter((month): month is string => !!month))
  ).sort();
  if (!months.length) return [];
  return months.length === 1 ? months : [months[0], months[months.length - 1]];
};
