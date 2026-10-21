import { memo } from 'react';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useLocales } from 'src/locales';
// types
import { IInternItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import InternQuickEditForm from './intern-quick-edit-form';
import ContactQuickEditForm from './contact-quick-edit-form';
import StudyQuickEditForm from './study-quick-edit-form';
import InternCancelOrderDialog from './intern-cancel-order-dialog';
//

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: (id: string) => void;
  onEditIsuzuRow: (id: string) => void;

  row: IInternItem;
  onSelectRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
  onViewRow: (id: string) => void;
  // Không truyền thì ẩn mục "Hủy đơn" (tài khoản demo). Trả về true khi hủy thành công.
  onCancelOrder?: (id: string) => Promise<boolean>;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

function InternTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  onEditIsuzuRow,
  onCancelOrder,
}: Props) {
  const { name, namejp, avatar, city, birthday, age, height, weight, createdAt } = row;

  const { t } = useLocales();

  const confirm = useBoolean();

  const cancelOrder = useBoolean();

  // Chỉ hủy đơn được khi TTS đang học (BE cũng kiểm tra lại).
  const canCancelOrder = row.status === 'study';

  const quickEdit = useBoolean();

  const quickContact = useBoolean();

  const quickStudy = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={() => onSelectRow(row._id)} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatar} sx={{ mr: 2 }} />

          <ListItemText
            primary={name}
            secondary={namejp}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{city}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{changDateJP(createdAt)}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{changDateJP(birthday)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{age}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{height}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{weight}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{changDateJP(createdAt)}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{changDateJP(birthday)}</TableCell> */}

        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell> */}

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {/* <Tooltip title="Nhập điểm" placement="top" arrow>
            <IconButton
              color={quickStudy.value ? 'inherit' : 'default'}
              onClick={quickStudy.onTrue}
            >
              <Iconify icon="material-symbols:school" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thêm thông tin liên lạc" placement="top" arrow>
            <IconButton
              color={quickContact.value ? 'inherit' : 'default'}
              onClick={quickContact.onTrue}
            >
              <Iconify icon="mdi:contact" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Thêm nghiệp đoàn và công ty" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="healthicons:job-status-level" />
            </IconButton>
          </Tooltip> */}

          <Tooltip title="Xem Thông Tin" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={() => {
                onViewRow(row._id);
              }}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Chỉ dựng form khi mở: mỗi form tự tải dữ liệu ngay khi dựng (liên hệ, danh sách nghiệp
          đoàn / công ty…). Dựng sẵn cho mọi dòng là mỗi trang bảng gọi hàng chục request, và tài
          khoản demo nhận cả thông tin liên lạc của từng TTS. */}
      {quickEdit.value && (
        <InternQuickEditForm
          currentIntern={row}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
        />
      )}

      {quickStudy.value && (
        <StudyQuickEditForm
          currentIntern={row}
          open={quickStudy.value}
          onClose={quickStudy.onFalse}
        />
      )}

      {quickContact.value && (
        <ContactQuickEditForm
          currentIntern={row}
          open={quickContact.value}
          onClose={quickContact.onFalse}
        />
      )}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow(row._id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh Sửa
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditIsuzuRow(row._id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh Sửa Isuzu
        </MenuItem>

        {onCancelOrder && (
          <MenuItem
            disabled={!canCancelOrder}
            onClick={() => {
              cancelOrder.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="solar:close-circle-bold" />
            <div>
              {t('intern_cancel_order')}
              {!canCancelOrder && (
                <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                  {t('intern_cancel_order_hint')}
                </Typography>
              )}
            </div>
          </MenuItem>
        )}

        {/* <MenuItem
          onClick={() => {
            onEditRow(row._id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Nghiệp đoàn
        </MenuItem> */}
      </CustomPopover>

      {onCancelOrder && (
        <InternCancelOrderDialog
          open={cancelOrder.value}
          name={name}
          onClose={cancelOrder.onFalse}
          onConfirm={() => onCancelOrder(row._id)}
        />
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá"
        content="Bạn có chắc muốn xóa thực tập sinh (thao tác này sẽ không hoàn tác lại được)?"
        action={
          <Button variant="contained" color="error" onClick={() => onDeleteRow(row._id)}>
            Xoá
          </Button>
        }
      />
    </>
  );
}

// Bọc memo: dòng bảng chỉ render lại khi chính prop của nó đổi.
// Chỉ có tác dụng vì các view truyền thẳng hàm ổn định (không phải arrow nội tuyến)
// và useTable.onSelectRow đã bỏ phụ thuộc vào `selected`.
export default memo(InternTableRow);
