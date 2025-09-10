/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { CircularProgress, Tooltip } from '@mui/material';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
// types
import { IOrderItem } from 'src/types/order';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import ExportInternsWithAvatar from 'src/utils/ExportInternsWithAvatar';
import ExportInternsPass from 'src/utils/ExportInternsPass';

import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
// import { pdf } from '@react-pdf/renderer';
import InternPDF from '../invoice/intern-pdf';
import AllInternsPDF from './AllInternsPDF';
import SwapForm from '../user/swap-form';
import AllInternsPDFNoScore from './AllInternsPDFNoScore';
import AllInternsPDFNoScoreKraepelin from './AllInternsPDFNoScoreKraepelin';

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onRemoveIntern: any;
  onViewInternRow: any;
  onEditRow: any;
  onHandleGetOrder: any;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onRemoveIntern,
  onViewInternRow,
  onEditRow,
  onHandleGetOrder,
}: Props) {
  const {
    status,
    name,
    work,
    priority,
    recruitmentDate,
    interviewFormat,
    quantity,
    listIntern,
    _id,
    createdAt,
  } = row;

  const [loadingDownloadAll, setLoadingDownloadAll] = useState(false);
  const [internSelect, setInternSelect] = useState('');

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const quickSwap = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={customer?.name} src={customer?.avatarUrl} sx={{ mr: 2 }} /> */}
        <Box
          // onClick={onViewRow}
          // sx={{
          //   cursor: 'pointer',
          //   '&:hover': {
          //     textDecoration: 'underline',
          //   },
          // }}
        >
          <ListItemText
            primary={name}
            secondary={work}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </Box>
      </TableCell>

      <TableCell>{priority}</TableCell>

      <TableCell>{changDateJP(recruitmentDate)}</TableCell>

      <TableCell align="center">{interviewFormat}</TableCell>

      <TableCell>{quantity}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Đang tuyển' && 'success') ||
            (status === 'Đã tuyển đủ' && 'warning') ||
            (status === 'Tạm ngưng tuyển' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell>{changDateJP(createdAt)}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {listIntern?.map((item: any, index: any) => (
              <Stack
                key={item._id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar src={item.avatar} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

                {/* <Box
                 
                > */}
                <ListItemText
                  onClick={() => onViewInternRow(item._id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  primary={`${index + 1}. ${item.name}`}
                  secondary={item.namejp}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                {/* </Box> */}

                {/* {item && (
                  <PDFDownloadLink
                    document={<InternPDF invoice={item} />}
                    fileName={item.name}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <Tooltip title="Download">
                        <IconButton>
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <Iconify icon="material-symbols:download" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </PDFDownloadLink>
                )} */}

                {item && (
                  <Tooltip title="Đổi Số Thự Tự" placement="top" arrow>
                    <IconButton
                      color={quickSwap.value ? 'inherit' : 'default'}
                      onClick={() => {
                        setInternSelect(item._id);
                        quickSwap.onTrue();
                      }}
                    >
                      <Iconify icon="ri:swap-fill" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* <Box>
                  <IconButton onClick={collapse.onToggle}>
                    <Iconify icon="material-symbols:download" />
                  </IconButton>
                </Box> */}

                <Box sx={{ textAlign: 'right' }}>
                  {' '}
                  <IconButton color="error" onClick={() => onRemoveIntern(_id, item._id)}>
                    <Iconify icon="mdi:trash" />
                  </IconButton>
                </Box>

                <SwapForm
                  orderId={_id}
                  internId={item._id}
                  internName={internSelect}
                  open={quickSwap.value}
                  onClose={quickSwap.onFalse}
                  onHandleGetOrder={onHandleGetOrder}
                />
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={async () => {
            try {
              setLoadingDownloadAll(true);
              const blob = await pdf(<AllInternsPDF interns={listIntern} />).toBlob();
              saveAs(blob, `All_CVs_${name}.pdf`);
            } catch (error) {
              console.error('Lỗi khi tạo PDF:', error);
            } finally {
              setLoadingDownloadAll(false);
              popover.onClose();
            }
          }}
        >
          <Iconify icon={loadingDownloadAll ? 'eos-icons:loading' : 'ic:baseline-download'} />
          {loadingDownloadAll ? 'Đang tạo PDF...' : 'Tải tất cả CV'}
        </MenuItem>

        <MenuItem
          onClick={async () => {
            try {
              setLoadingDownloadAll(true);
              const blob = await pdf(<AllInternsPDFNoScore interns={listIntern} />).toBlob();
              saveAs(blob, `All_CVs_${name}.pdf`);
            } catch (error) {
              console.error('Lỗi khi tạo PDF:', error);
            } finally {
              setLoadingDownloadAll(false);
              popover.onClose();
            }
          }}
        >
          <Iconify icon={loadingDownloadAll ? 'eos-icons:loading' : 'ic:baseline-download'} />
          {loadingDownloadAll ? 'Đang tạo PDF...' : 'Tải tất cả CV không có điểm'}
        </MenuItem>

          <MenuItem
          onClick={async () => {
            try {
              setLoadingDownloadAll(true);
              const blob = await pdf(<AllInternsPDFNoScoreKraepelin interns={listIntern} />).toBlob();
              saveAs(blob, `All_CVs_${name}.pdf`);
            } catch (error) {
              console.error('Lỗi khi tạo PDF:', error);
            } finally {
              setLoadingDownloadAll(false);
              popover.onClose();
            }
          }}
        >
          <Iconify icon={loadingDownloadAll ? 'eos-icons:loading' : 'ic:baseline-download'} />
          {loadingDownloadAll ? 'Đang tạo PDF...' : 'Tải tất cả CV không có điểm cộng dồn'}
        </MenuItem>

        <ExportInternsWithAvatar interns={listIntern} name={name} />

        <ExportInternsPass interns={listIntern} name={name} />

        <MenuItem onClick={onEditRow}>
          <Iconify icon="fluent:edit-48-filled" />
          Chỉnh sửa
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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
