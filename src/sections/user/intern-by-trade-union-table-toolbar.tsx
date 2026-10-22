import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
import { IInternTableFilters, IUserTableFilterValue } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useDebouncedFilter } from 'src/hooks/use-debounced-filter';
import { t } from 'i18next';

// ----------------------------------------------------------------------
// Thanh lọc ở trang TTS của nghiệp đoàn: công ty + tìm theo tên (cả katakana).
//
// Trước đây có menu ⋮ "Tải PDF điểm danh", lấy từ lịch điểm danh nhập tay — gần như không được
// nhập (mục mới nhất tháng 5/2026) nên file ra trống. Chủ dự án chọn bỏ: chuyên cần của đối tác
// giờ lấy từ điểm 出席状況 trong báo cáo tháng (tab 出席 của hồ sơ, gói báo cáo tháng).

type Props = {
  filters: IInternTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  companyOptions: string[];
};

export default function InternByTradeUnionTableToolbar({
  filters,
  onFilters,
  companyOptions,
}: Props) {
  // Ô nhập cập nhật ngay, nhưng chỉ báo lên view sau khi ngừng gõ —
  // tránh chạy lại applyFilter trên toàn bộ danh sách ở mỗi phím.
  const searchName = useDebouncedFilter(filters.name, (next) => onFilters('name', next));

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      searchName.onChange(event.target.value);
    },
    [searchName]
  );

  const handleFilterCompany = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'company',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ p: 2.5 }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>{t('company_new')}</InputLabel>

        <Select
          multiple
          value={filters.company}
          onChange={handleFilterCompany}
          input={<OutlinedInput label="Company" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {companyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.company?.includes(option) ?? false}
              />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        value={searchName.value}
        onChange={handleFilterName}
        placeholder={t('partner_search') || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
