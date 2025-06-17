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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IInternItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import InternQuickEditForm from './intern-quick-edit-form';
import ContactQuickEditForm from './contact-quick-edit-form';
import StudyQuickEditForm from './study-quick-edit-form';
//

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IInternItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function InternTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}: Props) {
  const { name, namejp, avatar, city, birthday, age, height, weight, createdAt } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const quickContact = useBoolean();

  const quickStudy = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
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
                onViewRow();
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

      <InternQuickEditForm currentIntern={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <StudyQuickEditForm
        currentIntern={row}
        open={quickStudy.value}
        onClose={quickStudy.onFalse}
      />

      <ContactQuickEditForm
        currentIntern={row}
        open={quickContact.value}
        onClose={quickContact.onFalse}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
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
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh Sửa
        </MenuItem>

         <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:school" />
          Nhập Điểm
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Nghiệp đoàn
        </MenuItem> */}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
