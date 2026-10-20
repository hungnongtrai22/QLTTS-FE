// types
import { IStudyItem } from 'src/types/user';
// utils
import { averageGrade, evaluateStudent } from 'src/utils/studyGrade';

// ----------------------------------------------------------------------
// Dữ liệu cho tab "Học tập" của hồ sơ TTS (study-overview.tsx) — trang nghiệp đoàn / công ty xem
// để theo dõi TTS. Mỗi báo cáo kèm báo cáo liền trước để so sánh.
// ----------------------------------------------------------------------

export type StudyScoreKey =
  | 'health'
  | 'cooperation'
  | 'attend'
  | 'discipline'
  | 'attitude'
  | 'acquiringKnowledge'
  | 'write'
  | 'read'
  | 'listen'
  | 'speak';

// (B) Đánh giá chung / (C) Năng lực tiếng Nhật — cùng hai nhóm với mẫu báo cáo PDF.
export const GENERAL_KEYS: StudyScoreKey[] = [
  'health',
  'cooperation',
  'attend',
  'discipline',
  'attitude',
];
export const JAPANESE_KEYS: StudyScoreKey[] = [
  'acquiringKnowledge',
  'write',
  'read',
  'listen',
  'speak',
];

// 4 kỹ năng tiếng Nhật (điểm trung bình = học lực A+…C)
export const SKILL_KEYS: StudyScoreKey[] = ['write', 'read', 'listen', 'speak'];

export const LESSON_MAX = 50;

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

// monthAndYear lưu 00:00 giờ VN (= 17:00 UTC hôm trước) → năm / tháng theo giờ VN.
export const reportMonth = (value: string | Date) => {
  const date = new Date(new Date(value).getTime() + VN_OFFSET_MS);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
};

// Ô "Tiến độ học tập": "入門" = bài 0, "皆の日本語第45課" = bài 45; còn lại (vd 復習) = null.
export const lessonOf = (value: string) => {
  const text = String(value || '');
  if (text.includes('入門')) return 0;
  const match = text.match(/第\s*(\d+)\s*課/);
  return match ? Number(match[1]) : null;
};

export type StudyView = {
  report: IStudyItem;
  year: number;
  month: number;
  // Báo cáo liền trước (theo tháng); null = báo cáo đầu tiên
  prev: IStudyItem | null;
  // Báo cáo trước đúng là tháng liền trước → "so với tháng trước", không thì "so với lần trước"
  prevIsLastMonth: boolean;
  evaluation: string;
  grade: string;
  lesson: number | null;
};

// Mới nhất trước. Bỏ báo cáo không có tháng (dữ liệu cũ hỏng).
export function buildStudyViews(studies: IStudyItem[]): StudyView[] {
  const sorted = studies
    .filter((report) => report.monthAndYear)
    .sort((a, b) => new Date(b.monthAndYear).getTime() - new Date(a.monthAndYear).getTime());

  return sorted.map((report, index) => {
    const { year, month } = reportMonth(report.monthAndYear);
    const prev = sorted[index + 1] || null;
    const prevMonth = prev ? reportMonth(prev.monthAndYear) : null;
    const prevIsLastMonth =
      !!prevMonth && year * 12 + month - (prevMonth.year * 12 + prevMonth.month) === 1;
    return {
      report,
      year,
      month,
      prev,
      prevIsLastMonth,
      evaluation: evaluateStudent(
        report.discipline,
        report.attitude,
        report.health,
        report.cooperation,
        report.attend,
        Number(report.total) || 0
      ),
      grade: averageGrade(Number(report.average) || 0),
      lesson: lessonOf(report.learningProcess),
    };
  });
}

// Thang trục tổng điểm: làm tròn ra bội 50 quanh dữ liệu để đường không dính mép.
export const totalAxis = (totals: number[]) => {
  if (!totals.length) return { min: 0, max: 1000 };
  const min = Math.max(0, Math.floor((Math.min(...totals) - 30) / 50) * 50);
  const max = Math.min(1000, Math.ceil((Math.max(...totals) + 30) / 50) * 50);
  return { min, max };
};
