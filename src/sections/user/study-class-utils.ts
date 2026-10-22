import { LabelColor } from 'src/components/label';
//
import { uniqueSorted } from './study-report-utils';

// ----------------------------------------------------------------------
// Dùng chung cho trang Lớp, hộp thoại xếp lớp và bộ lọc "Lớp" ở trang Báo cáo học tập /
// Nhập điểm hàng loạt.

// Giá trị bộ lọc "Chưa xếp lớp" (TTS không có lớp). Là một mã cố định chứ không phải chữ hiển
// thị, để đổi ngôn ngữ giao diện không làm mất lựa chọn đang lọc.
export const NO_CLASS = '__no_class__';

// Khóa lọc theo lớp của một dòng: tên lớp, hoặc NO_CLASS.
export const classFilterValue = (studyClass: string) => studyClass || NO_CLASS;

// Lựa chọn của bộ lọc "Lớp": các lớp có trong danh sách đang xem, "Chưa xếp lớp" ở cuối.
export const classOptions = (names: string[]) => [
  ...uniqueSorted(names),
  ...(names.some((name) => !name) ? [NO_CLASS] : []),
];

// Giáo viên của một dòng ở trang Báo cáo học tập / Nhập hàng loạt: giáo viên của báo cáo tháng
// này; chưa nhập thì giáo viên của lớp, rồi tới giáo viên gần nhất.
export const expectedTeacher = (row: {
  report: { teacher: string } | null;
  classTeacher: string;
  lastTeacher: string;
}) => row.report?.teacher || row.classTeacher || row.lastTeacher;

// Trạng thái TTS → khóa i18n + màu nhãn, cùng cách hiển thị với các tab ở danh sách TTS.
export const INTERN_STATUS: Record<string, { label: string; color: LabelColor }> = {
  study: { label: 'studying', color: 'success' },
  interview: { label: 'interview', color: 'default' },
  pass: { label: 'pass', color: 'warning' },
  complete: { label: 'complete', color: 'error' },
  soon: { label: 'soon', color: 'info' },
  wait: { label: 'wait', color: 'default' },
};
