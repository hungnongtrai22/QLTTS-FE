// Các năm cho bộ lọc "Năm xuất cảnh": từ 2022 (năm sớm nhất có dữ liệu) tới năm hiện tại.
// Tự sinh để sang năm mới không phải sửa tay danh sách.
const FIRST_DEPARTURE_YEAR = 2022;

export const departure = Array.from(
  { length: new Date().getFullYear() - FIRST_DEPARTURE_YEAR + 1 },
  (_, index) => String(FIRST_DEPARTURE_YEAR + index)
);
