// @mui
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { ISourceItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import axios from 'axios';
import { useCallback } from 'react';
import TradeUnionCreateAccountForm from './trade-union-create-account-form';

//

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ISourceItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function SourceTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, state, phone, createdAt, _id } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const deleteTradeUnionHandler = useCallback(async (id: string) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/delete`, {
        _id: id,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

    const deleteCompanyByTradeUnionHandler = useCallback(async (id: string) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/company/deleteByTradeUnion`, {
        tradeUnion: id,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatar} sx={{ mr: 2 }} /> 

          <ListItemText
            primary={name}
            // secondary={namejp}
            primaryTypographyProps={{ typography: 'body2' }}
            // secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{city}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{state}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{country}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{changDateJP(createdAt)}</TableCell>

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
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <TradeUnionCreateAccountForm
        tradeUnion={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      /> */}

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
            deleteTradeUnionHandler(_id);
            deleteCompanyByTradeUnionHandler(_id);
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
          Edit
        </MenuItem>
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
