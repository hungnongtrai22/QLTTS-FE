import { useCallback, useEffect, useRef, useState } from 'react';

// ----------------------------------------------------------------------
// Ô tìm kiếm trong các thanh công cụ của bảng.
//
// Trước đây mỗi phím gõ gọi thẳng onFilters('name', ...), khiến view chạy lại
// applyFilter trên TOÀN BỘ danh sách — sắp xếp lại mảng rồi lọc tuần tự. Với danh
// sách vài trăm bản ghi thì gõ bị khựng.
//
// Hook giữ giá trị hiển thị ngay lập tức (ô nhập không bị trễ) nhưng chỉ báo lên
// view sau khi người dùng ngừng gõ.
// ----------------------------------------------------------------------

const DEFAULT_DELAY = 300;

export function useDebouncedFilter(
  value: string,
  onCommit: (next: string) => void,
  delay: number = DEFAULT_DELAY
) {
  const [localValue, setLocalValue] = useState(value);

  // Giữ callback trong ref để timer không phải tạo lại mỗi lần cha render.
  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  // Đồng bộ khi giá trị bị đổi từ bên ngoài (ví dụ bấm "xoá bộ lọc").
  const lastCommitted = useRef(value);
  useEffect(() => {
    if (value !== lastCommitted.current) {
      lastCommitted.current = value;
      setLocalValue(value);
    }
  }, [value]);

  const onChange = useCallback((next: string) => {
    setLocalValue(next);
  }, []);

  useEffect(() => {
    if (localValue === lastCommitted.current) {
      return undefined;
    }

    const timer = setTimeout(() => {
      lastCommitted.current = localValue;
      onCommitRef.current(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay]);

  return { value: localValue, onChange };
}

export default useDebouncedFilter;
