// ----------------------------------------------------------------------
// Quy tắc nhập báo cáo học tập (chủ dự án đặt, 10/2026). BE kiểm tra lại y hệt ở
// QLTTS-BE/src/utils/studyRules.ts — sửa thì sửa cả hai.
//
// 1. Thi thử JLPT chỉ nhập được khi đã học tới bài nhất định, theo trình độ của báo cáo:
//    N5 → từ bài 25, N4 → từ bài 45; N3 trở lên không khóa. Áp dụng cho mọi tài khoản.
//    Điểm thi thử đã lưu từ trước giữ nguyên: chỉ chặn giá trị mới hoặc thay đổi.
// 2. Tài khoản nguồn chỉ viết / sửa báo cáo của tháng M từ 00:00 ngày 23 tháng M (giờ VN);
//    không đóng lại sau khi hết tháng. Admin không bị giới hạn.
// Mẫu nhận xét cho TTS của nguồn: xem SOURCE_COMMENT_TEMPLATE trong study-bulk-utils.ts.
// ----------------------------------------------------------------------

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

export const JLPT_MOCK_MIN_LESSON: Record<string, number> = { N5: 25, N4: 45 };

// Số bài từ ô tiến độ ("皆の日本語第30課" → 30; chữ số toàn độ rộng cũng đọc được).
// 入門 / ひらがな・カタカナ = 0. Không đọc được (復習 không kèm số bài, giáo trình khác…) → null.
export const lessonOf = (value: unknown): number | null => {
  const text = String(value || '').normalize('NFKC');
  if (/入門|ひらがな|平仮名|カタカナ|片仮名/.test(text)) return 0;
  const match = text.match(/第\s*(\d+)/);
  return match ? Number(match[1]) : null;
};

export type JlptMockLock = { level: string; min: number; lesson: number };

// null = nhập được thi thử. Không đọc được số bài thì không khóa (giáo trình khác, ôn tập…).
export function jlptMockLock(level: unknown, learningProcess: unknown): JlptMockLock | null {
  const min = JLPT_MOCK_MIN_LESSON[String(level || '')];
  if (!min) return null;
  const lesson = lessonOf(learningProcess);
  if (lesson === null || lesson >= min) return null;
  return { level: String(level), min, lesson };
}

// ---- Mốc ngày 23 (tài khoản nguồn)

export const REPORT_OPEN_DAY = 23;

// Thời điểm mở viết báo cáo của tháng (year, month 1–12): 00:00 ngày 23 giờ VN.
export const reportOpenTime = (year: number, month: number) =>
  Date.UTC(year, month - 1, REPORT_OPEN_DAY) - VN_OFFSET_MS;
