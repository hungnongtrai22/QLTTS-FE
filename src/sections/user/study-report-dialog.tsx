// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IStudyReportRow } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
//
import InternPointForm from './intern-point-form';

// ----------------------------------------------------------------------

type Props = {
  row: IStudyReportRow | null;
  month: Date;
  monthLabel: string;
  onClose: VoidFunction;
  onSaved: VoidFunction;
};

// Nhập/sửa báo cáo của một TTS ngay trên trang theo dõi, không phải mở hồ sơ.
// Dùng lại đúng form của tab "Nhập điểm" trong hồ sơ, mở sẵn ở tháng đang xem.
export default function StudyReportDialog({ row, month, monthLabel, onClose, onSaved }: Props) {
  const smUp = useResponsive('up', 'sm');

  return (
    <Dialog fullWidth maxWidth="lg" fullScreen={!smUp} open={!!row} onClose={onClose}>
      <DialogTitle sx={{ py: 2, pr: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={row?.name} src={row?.avatar} />
          <ListItemText
            primary={row?.name}
            secondary={monthLabel}
            primaryTypographyProps={{ typography: 'subtitle1', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', color: 'text.secondary' }}
            sx={{ minWidth: 0 }}
          />
          <IconButton onClick={onClose} sx={{ p: 1.5 }}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: 'background.neutral', pt: 3, pb: 3, px: { xs: 1.5, sm: 3 } }}>
        {row && (
          <Stack spacing={3} sx={{ pt: 3 }}>
            <InternPointForm
              key={`${row._id}-${month.getTime()}`}
              internId={row._id}
              initialMonth={month}
              onSaved={onSaved}
            />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
