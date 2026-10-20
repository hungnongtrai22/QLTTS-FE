// ----------------------------------------------------------------------
// Cách đọc điểm báo cáo học tập dùng chung cho mẫu PDF báo cáo (intern-pdf-study.tsx) và gói
// báo cáo gửi đối tác (PDF tổng hợp + Excel). Để ở file riêng, không import @react-pdf/renderer,
// nên file Excel dùng được mà không kéo thư viện PDF (~1,3 MB) vào trang.
// ----------------------------------------------------------------------

// Tên TTS không dấu, in hoa — như trên mẫu báo cáo gửi đối tác.
export function normalizeName(name: string): string {
  return name
    .normalize('NFD') // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd') // đ -> d
    .replace(/Đ/g, 'D') // Đ -> D
    .replace(/[^A-Za-z\s]/g, '') // Loại bỏ ký tự không phải chữ cái hoặc khoảng trắng
    .toUpperCase() // In hoa
    .trim() // Bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, ' '); // Chuẩn hóa khoảng trắng giữa các từ
}

// Đánh giá tổng hợp (秀 / 優 / 良 / 可 / 不可) theo tổng điểm và các mục bắt buộc.
export const evaluateStudent = (
  discipline: number,
  attitude: number,
  health: number,
  cooperation: number,
  attend: number,
  total: number
): string => {
  const hasCriticalFail =
    (discipline < 50 && attitude < 50) ||
    health < 50 ||
    cooperation < 50 ||
    attend < 50 ||
    total < 500;

  if (hasCriticalFail) return '不可';
  if (total < 700) return '可';
  if (total < 800) return '良';
  if (total < 900) return '優';
  return '秀';
};

// Ký hiệu của từng mục điểm (thang 100) — như trên mẫu báo cáo PDF.
export const scoreSymbol = (point: number): string => {
  if (point < 50) return '×';
  if (point < 70) return '△';
  if (point < 80) return '○';
  if (point < 90) return '◎';
  return '●';
};

// Học lực theo điểm trung bình 4 kỹ năng tiếng Nhật — như trên mẫu báo cáo PDF.
export const averageGrade = (point: number): string => {
  if (point < 50) return 'C';
  if (point < 60) return 'B-';
  if (point < 70) return 'B';
  if (point < 80) return 'B+';
  if (point < 90) return 'A';
  return 'A+';
};
