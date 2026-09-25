import { useCallback, useState } from 'react';
import { saveAs } from 'file-saver';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
// auth
import { useAuthContext } from 'src/auth/hooks';
// locales
import { useLocales } from 'src/locales';
// utils
import { buildContractData, contractFileName, getMissingContractFields } from 'src/utils/contract';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
// Nút "In hợp đồng" (PDF / Excel). Dùng ở form Hồ sơ xuất cảnh (một người) và ở thanh chọn
// hàng loạt của danh sách TTS (nhiều người).
//
// Chỉ admin thấy nút: hợp đồng có CCCD, hộ chiếu và bảng phí. Trang hồ sơ TTS không có
// RoleBasedGuard nên nút phải tự kiểm tra role.
//
// @react-pdf/renderer, ExcelJS và khuôn Excel chỉ nạp lúc bấm, không nằm trong bundle trang.
// ----------------------------------------------------------------------

type Props = {
  // Trả về hồ sơ ĐẦY ĐỦ, đã populate tradeUnion + companySelect (GET /api/user/:id).
  loadInterns: () => Promise<any[]>;
  // Trả false để huỷ (nơi gọi tự báo lý do), vd. form còn thay đổi chưa lưu.
  canPrint?: () => boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  // 'small' cho thanh chọn nhiều dòng ở chế độ thu gọn (cao 38px).
  size?: 'small' | 'medium';
};

type Kind = 'pdf' | 'xlsx';

const MAX_LISTED = 6;

export default function InternContractButton({
  loadInterns,
  canPrint,
  disabled,
  fullWidth,
  size = 'medium',
}: Props) {
  const { user } = useAuthContext();
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const popover = usePopover();
  const [busy, setBusy] = useState<Kind | null>(null);

  const { onClose } = popover;

  const handlePrint = useCallback(
    async (kind: Kind) => {
      onClose();
      if (canPrint && !canPrint()) return;

      setBusy(kind);
      try {
        const interns = await loadInterns();
        if (!interns.length) return;

        // Thiếu vẫn in (PDF để dòng chấm cho viết tay) nhưng báo trước để khỏi bất ngờ.
        const missing = interns.map((intern) =>
          getMissingContractFields(buildContractData(intern))
        );
        if (interns.length === 1 && missing[0].length) {
          // Tối đa 6 mục cho snackbar khỏi thành một khối chữ dài trên điện thoại.
          const labels = missing[0].map((key) => t(key));
          const fields =
            labels.length > MAX_LISTED
              ? `${labels.slice(0, MAX_LISTED).join(', ')} ${t('contract_missing_more', {
                  count: labels.length - MAX_LISTED,
                })}`
              : labels.join(', ');
          enqueueSnackbar(t('contract_missing', { fields }), { variant: 'warning' });
        } else if (interns.length > 1) {
          const count = missing.filter((fields) => fields.length).length;
          if (count) enqueueSnackbar(t('contract_missing_many', { count }), { variant: 'warning' });
        }

        if (kind === 'pdf') {
          const [{ pdf }, { default: InternContractPDF }] = await Promise.all([
            import('@react-pdf/renderer'),
            import('src/sections/invoice/intern-pdf-contract'),
          ]);
          const blob = await pdf(<InternContractPDF interns={interns} />).toBlob();
          saveAs(blob, contractFileName(interns, 'pdf'));
        } else {
          const { exportContractsExcel } = await import('src/utils/ExportContract');
          await exportContractsExcel(interns);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t('contract_export_failed'), { variant: 'error' });
      } finally {
        setBusy(null);
      }
    },
    [canPrint, enqueueSnackbar, loadInterns, onClose, t]
  );

  if (user?.role !== 'admin') return null;

  return (
    <>
      <LoadingButton
        variant="outlined"
        color="inherit"
        loading={!!busy}
        loadingPosition="start"
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
        endIcon={!busy && <Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={popover.onOpen}
        sx={{ minHeight: size === 'small' ? undefined : 44, whiteSpace: 'nowrap' }}
      >
        {busy ? t('contract_preparing') : t('print_contract')}
      </LoadingButton>

      <CustomPopover open={popover.open} onClose={onClose} arrow="top-right" sx={{ width: 220 }}>
        <MenuItem onClick={() => handlePrint('pdf')} sx={{ minHeight: 44 }}>
          <Iconify icon="solar:file-text-bold" />
          {t('contract_pdf')}
        </MenuItem>
        <MenuItem onClick={() => handlePrint('xlsx')} sx={{ minHeight: 44 }}>
          <Iconify icon="solar:export-bold" />
          {t('contract_excel')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
