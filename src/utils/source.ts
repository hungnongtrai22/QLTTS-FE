// TTS không có nguồn tuyển được coi là thuộc nguồn "Nhật Tân". Đây là một lựa chọn ảo trong
// bộ lọc "Nguồn" (chưa có document Source nào tên này) — BE /api/user/list hiểu tên này là
// "source trống". Cùng quy ước với thống kê countSource ở trang tổng quan.
export const DEFAULT_SOURCE_NAME = 'Nhật Tân';
