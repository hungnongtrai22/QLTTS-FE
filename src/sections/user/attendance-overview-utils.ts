// types
import { IStudyItem } from 'src/types/user';
// utils
import { scoreSymbol } from 'src/utils/studyGrade';
//
import { reportMonth } from './study-overview-utils';

// ----------------------------------------------------------------------
// Tab 出席 của hồ sơ TTS phía đối tác (study-attendance-overview.tsx).
//
// Chuyên cần lấy từ điểm 出席状況 (attend, thang 100) mà giáo viên chấm trong báo cáo học tập
// hằng tháng — CHỈ báo cáo đã công khai. Lịch điểm danh nhập tay (attendance) gần như không
// được nhập (mục mới nhất 5/2026), nên chỉ dùng để kèm chi tiết nghỉ cho tháng nào có ghi nhận.
// ----------------------------------------------------------------------

// Dưới mức này là "thấp". Trang Báo cáo học tập dùng chung hằng này cho lý do "Cần chú ý"
// về chuyên cần, nên đổi ở đây là đổi cả hai nơi.
export const ATTEND_LOW = 80;

// Số báo cáo gần nhất dùng cho ô trung bình / ô ghi nhận nghỉ.
export const ATTEND_RECENT = 6;

// Một mục của lịch điểm danh (attendance/getAllAttendByInternId), kèm tháng của bản ghi.
export type AttendItem = {
  _id?: string;
  title?: string;
  allDay?: boolean;
  am?: boolean;
  pm?: boolean;
  late?: boolean;
  soon?: boolean;
  off?: boolean;
  start?: string;
  end?: string;
  month: number;
  year: number;
};

export type AttendKind = 'day' | 'am' | 'pm' | 'late' | 'soon';

const DAY_MS = 24 * 60 * 60 * 1000;
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

// Ngày theo giờ VN (UTC+7) của một mốc thời gian.
const vnDate = (iso: string) => new Date(new Date(iso).getTime() + VN_OFFSET_MS);

// Đi muộn / về sớm / nửa buổi / cả ngày. Thực tế dữ liệu: phần lớn "cả ngày" (allDay), một
// số nửa buổi (am / pm); đi muộn, về sớm chưa từng dùng nhưng vẫn đọc đúng nếu có.
export const attendKind = (item: AttendItem): AttendKind => {
  if (item.late) return 'late';
  if (item.soon) return 'soon';
  if (item.am && !item.pm && !item.allDay) return 'am';
  if (item.pm && !item.am && !item.allDay) return 'pm';
  return 'day';
};

// Mục kéo dài nhiều ngày (lịch kéo-thả: kết thúc lúc 00:00 ngày sau, không tính ngày đó).
const spanDays = (item: AttendItem) =>
  item.start && item.end
    ? (new Date(item.end).getTime() - new Date(item.start).getTime()) / DAY_MS
    : 0;

// Số ngày nghỉ của một mục: cả ngày = 1, nửa buổi = 0,5, kéo dài = số ngày thường (thứ 2–6).
export const absentDays = (item: AttendItem) => {
  const kind = attendKind(item);
  if (kind === 'late' || kind === 'soon') return 0;
  if (kind === 'am' || kind === 'pm') return 0.5;
  if (spanDays(item) >= 1 && item.start) {
    const start = vnDate(item.start);
    let days = 0;
    for (let i = 0; i < Math.round(spanDays(item)); i += 1) {
      const weekday = new Date(start.getTime() + i * DAY_MS).getUTCDay();
      if (weekday !== 0 && weekday !== 6) days += 1;
    }
    return days;
  }
  return 1;
};

// Ngày (hoặc khoảng ngày) của mục: { start, end } theo giờ VN; end = null nếu một ngày.
export const attendDates = (item: AttendItem) => {
  if (!item.start) return null;
  const start = vnDate(item.start);
  const span = Math.round(spanDays(item));
  const end = span > 1 ? new Date(start.getTime() + (span - 1) * DAY_MS) : null;
  return { start, end };
};

// Một dòng ghi nhận để hiển thị: các ngày nghỉ liền nhau cùng loại, cùng lý do gộp thành một
// khoảng ("4月13日〜17日（終日）田舎へ帰るため" thay vì 5 dòng).
export type AttendRecordGroup = {
  key: string;
  start: Date; // giờ VN (đọc bằng getUTC*)
  end: Date | null; // null = một ngày
  kind: AttendKind;
  reason: string;
};

// Ngày làm việc (thứ 2–6) kế tiếp sau một ngày.
const nextWeekday = (date: Date) => {
  let next = new Date(date.getTime() + DAY_MS);
  while (next.getUTCDay() === 0 || next.getUTCDay() === 6) {
    next = new Date(next.getTime() + DAY_MS);
  }
  return next;
};

const sameDay = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

export function groupRecords(records: AttendItem[]): AttendRecordGroup[] {
  const groups: AttendRecordGroup[] = [];
  records.forEach((item, index) => {
    const dates = attendDates(item);
    if (!dates) return;
    const kind = attendKind(item);
    const reason = (item.title || '').trim();
    const last = groups[groups.length - 1];
    if (
      last &&
      kind === 'day' &&
      last.kind === 'day' &&
      last.reason === reason &&
      sameDay(nextWeekday(last.end || last.start), dates.start)
    ) {
      last.end = dates.end || dates.start;
      return;
    }
    groups.push({
      key: item._id || String(index),
      start: dates.start,
      end: dates.end,
      kind,
      reason,
    });
  });
  return groups;
}

export type AttendanceMonth = {
  key: string; // YYYY-MM
  year: number;
  month: number;
  reportId: string;
  score: number;
  symbol: string;
  low: boolean;
  records: AttendItem[];
  groups: AttendRecordGroup[];
  absent: number; // ngày
  late: number; // lần
  soon: number; // lần
};

const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

/** Mỗi báo cáo công khai một tháng, mới nhất trước; kèm ghi nhận nghỉ của đúng tháng đó. */
export function buildAttendanceMonths(
  reports: IStudyItem[],
  items: AttendItem[]
): AttendanceMonth[] {
  const byMonth = new Map<string, AttendItem[]>();
  items.forEach((item) => {
    const key = monthKey(item.year, item.month);
    byMonth.set(key, [...(byMonth.get(key) || []), item]);
  });

  return reports
    .filter((report) => report.monthAndYear && report.isPublic !== false)
    .sort((a, b) => new Date(b.monthAndYear).getTime() - new Date(a.monthAndYear).getTime())
    .map((report) => {
      const { year, month } = reportMonth(report.monthAndYear);
      const key = monthKey(year, month);
      const records = (byMonth.get(key) || []).sort(
        (a, b) => new Date(a.start || 0).getTime() - new Date(b.start || 0).getTime()
      );
      const score = Number(report.attend) || 0;
      return {
        key,
        year,
        month,
        reportId: report._id,
        score,
        symbol: scoreSymbol(score),
        low: score < ATTEND_LOW,
        records,
        groups: groupRecords(records),
        absent: records.reduce((sum, item) => sum + absentDays(item), 0),
        late: records.filter((item) => attendKind(item) === 'late').length,
        soon: records.filter((item) => attendKind(item) === 'soon').length,
      };
    });
}

export type AttendanceSummary = {
  latest: AttendanceMonth | null;
  // So với báo cáo liền trước; deltaVsLastMonth = báo cáo đó đúng là tháng trước
  delta: number | null;
  deltaVsLastMonth: boolean;
  recent: AttendanceMonth[]; // ATTEND_RECENT báo cáo gần nhất, mới nhất trước
  average: number | null;
  lowMonths: AttendanceMonth[]; // mọi tháng dưới ATTEND_LOW, mới nhất trước
  recentAbsent: number;
  recentLate: number;
  recentSoon: number;
  // Có ghi nhận nghỉ ở bất kỳ tháng nào → mới hiện ô / cột ghi nhận
  hasRecords: boolean;
};

const monthIndex = (row: AttendanceMonth) => row.year * 12 + row.month;

export function summarizeAttendance(months: AttendanceMonth[]): AttendanceSummary {
  const [latest, prev] = months;
  const recent = months.slice(0, ATTEND_RECENT);
  return {
    latest: latest || null,
    delta: latest && prev ? latest.score - prev.score : null,
    deltaVsLastMonth: !!latest && !!prev && monthIndex(latest) - monthIndex(prev) === 1,
    recent,
    average: recent.length
      ? Math.round((recent.reduce((sum, row) => sum + row.score, 0) / recent.length) * 10) / 10
      : null,
    lowMonths: months.filter((row) => row.low),
    recentAbsent: recent.reduce((sum, row) => sum + row.absent, 0),
    recentLate: recent.reduce((sum, row) => sum + row.late, 0),
    recentSoon: recent.reduce((sum, row) => sum + row.soon, 0),
    hasRecords: months.some((row) => row.records.length > 0),
  };
}
