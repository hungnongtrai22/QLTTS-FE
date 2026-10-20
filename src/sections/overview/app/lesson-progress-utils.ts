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

export type LessonStats = {
  count: number;
  // TTS chưa rõ bài: chưa có báo cáo nào, hoặc chỉ có báo cáo "ôn tập" không kèm số bài
  missing: number;
  min: number | null;
  max: number | null;
  median: number | null;
  stages: Record<LessonStage, number>;
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
