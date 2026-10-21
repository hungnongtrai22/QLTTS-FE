import { useMemo, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
// locales
import { useLocales } from 'src/locales';
// utils
import { DEFAULT_SOURCE_NAME } from 'src/utils/source';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
// Nút gán nhanh nguồn tuyển cho một TTS trong danh sách ứng viên của đơn hàng.
// Chọn "Nhật Tân" = bỏ nguồn (TTS không có nguồn), cùng quy ước với bộ lọc nguồn.
// ----------------------------------------------------------------------

type SourceOption = { _id: string; name: string };

type Props = {
  internId: string;
  internName: string;
  // '' = chưa có nguồn (Nhật Tân)
  sourceId: string;
  sources: SourceOption[];
  // Trả về true khi lưu được — lỗi do view báo bằng snackbar
  onChange: (internId: string, sourceId: string) => Promise<boolean>;
};

export default function OrderInternSourceButton({
  internId,
  internName,
  sourceId,
  sources,
  onChange,
}: Props) {
  const { t } = useLocales();
  const popover = usePopover();
  const [pending, setPending] = useState<string | null>(null);

  const options = useMemo(
    () =>
      sources
        .filter((item) => item.name !== DEFAULT_SOURCE_NAME)
        .sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    [sources]
  );

  const handleSelect = async (value: string) => {
    if (pending) return;
    if (value === sourceId) {
      popover.onClose();
      return;
    }
    setPending(value);
    const ok = await onChange(internId, value);
    setPending(null);
    if (ok) popover.onClose();
  };

  const renderOption = (value: string, label: string, secondary?: string) => {
    const current = value === sourceId;
    return (
      <MenuItem
        key={value || 'none'}
        selected={current}
        disabled={!!pending && pending !== value}
        onClick={() => handleSelect(value)}
        sx={{ minHeight: 44 }}
      >
        <ListItemText
          primary={label}
          secondary={secondary}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ typography: 'caption' }}
        />
        {pending === value && <CircularProgress size={16} sx={{ ml: 1, flexShrink: 0 }} />}
        {current && !pending && (
          <Iconify
            icon="eva:checkmark-fill"
            sx={{ ml: 1, mr: '0 !important', color: 'primary.main' }}
          />
        )}
      </MenuItem>
    );
  };

  return (
    <>
      {/* Chưa có nguồn: viền đứt, nổi hơn — đó là việc cần làm. Đã có nguồn: nút chữ nhạt. */}
      <Button
        variant={sourceId ? 'text' : 'outlined'}
        color="inherit"
        startIcon={<Iconify icon={sourceId ? 'solar:pen-bold' : 'mingcute:add-line'} />}
        onClick={popover.onOpen}
        sx={{
          minHeight: { xs: 44, sm: 40 },
          whiteSpace: 'nowrap',
          ...(sourceId ? { color: 'text.secondary' } : { borderStyle: 'dashed' }),
        }}
      >
        {/* Điện thoại: nhãn ngắn để cả hàng nút vừa một dòng (icon đã phân biệt thêm / đổi) */}
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {sourceId ? t('order_change_source') : t('order_add_source')}
        </Box>
        <Box component="span" sx={{ display: { sm: 'none' } }}>
          {t('source')}
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={pending ? undefined : popover.onClose}
        arrow="top-right"
        hiddenArrow
        sx={{ width: 260, maxHeight: { xs: '60vh', md: 420 }, overflowY: 'auto' }}
      >
        <Box sx={{ px: 1, pt: 0.5, pb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {t('order_source_for')}
          </Typography>
          <Typography variant="subtitle2" noWrap>
            {internName}
          </Typography>
        </Box>

        {renderOption('', DEFAULT_SOURCE_NAME, t('order_source_none') || '')}

        <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

        {options.map((item) => renderOption(String(item._id), item.name))}
      </CustomPopover>
    </>
  );
}
