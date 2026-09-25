// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useLocales } from 'src/locales';
// types
import { IAccountItem } from 'src/types/user';
// utils
import { getRoleLabel, roleColor } from 'src/utils/role';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IAccountItem;
  /** Tài khoản đang đăng nhập: không cho tự xoá chính mình. */
  isCurrentUser: boolean;
  onEditRow: VoidFunction;
  onResetPassword: VoidFunction;
  onDeleteRow: VoidFunction;
};

const formatDate = (date: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('vi-VN');
};

export default function AccountTableRow({
  row,
  isCurrentUser,
  onEditRow,
  onResetPassword,
  onDeleteRow,
}: Props) {
  const { t, currentLang } = useLocales();

  const confirm = useBoolean();

  const popover = usePopover();

  const { name, username, email, role, tradeUnion, source, companySelect, createdAt } = row;

  // Nghiệp đoàn và nguồn tuyển là hai liên kết loại trừ nhau, tuỳ theo role.
  const linkedName = tradeUnion?.name || source?.name || '—';

  // Quy ước dữ liệu: companySelect vắng mặt (hoặc rỗng) = xem được toàn bộ công ty
  // của nghiệp đoàn. Có giá trị = chỉ xem được đúng những công ty đó.
  const companyScope =
    role === 'tradeunion'
      ? (companySelect?.length && t('account_scope_limited', { count: companySelect.length })) ||
        t('account_scope_all')
      : null;

  return (
    <>
      <TableRow hover>
        <TableCell>
          <ListItemText
            primary={
              <>
                {name}
                {isCurrentUser && (
                  <Label variant="soft" color="default" sx={{ ml: 1 }}>
                    {t('account_you')}
                  </Label>
                )}
              </>
            }
            secondary={username}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={roleColor[role] || 'default'}>
            {getRoleLabel(role, currentLang.value)}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={linkedName}
            secondary={companyScope}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
              color: companySelect?.length ? 'warning.main' : 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email || '—'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(createdAt)}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title={t('account_actions')} placement="top" arrow>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onResetPassword();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:key-bold" />
          {t('account_reset_password_action')}
        </MenuItem>

        <MenuItem
          disabled={isCurrentUser}
          onClick={() => {
            popover.onClose();
            confirm.onTrue();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('account_delete_confirm', { name })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
    </>
  );
}
