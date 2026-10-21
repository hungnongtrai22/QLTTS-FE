// TTS không có nguồn tuyển được coi là thuộc nguồn "Nhật Tân". Đây là một lựa chọn ảo trong
// bộ lọc "Nguồn" (chưa có document Source nào tên này) — BE /api/user/list hiểu tên này là
// "source trống". Cùng quy ước với thống kê countSource ở trang tổng quan.
export const DEFAULT_SOURCE_NAME = 'Nhật Tân';

// Id nguồn của TTS — source có thể là id hoặc object đã populate. '' = không có nguồn.
export const sourceIdOf = (intern: any): string => {
  const source = intern?.source;
  if (!source) return '';
  return String(typeof source === 'object' ? source._id : source);
};
