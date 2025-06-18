import * as Yup from 'yup';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// routes
// _mock
// types
import { IContactItem, IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IContactItem, 'avatarUrl'> {
  stt: number | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  orderId: string;
  internId: string;
  internName: string;
  onHandleGetOrder: any;
};

export default function SwapForm({
  orderId,
  internId,
  internName,
  open,
  onClose,
  onHandleGetOrder,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useLocales();

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      stt: null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /* eslint-disable object-shorthand */

  const swapIntern = useCallback(
    async (item: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/swapIntern`, {
        _id: orderId,
        internId: internName,
        newIndex: item.newIndex - 1,
      });

      return data;
      // console.log(orderId, internId, item.newIndex - 1);
    },
    [orderId, internName]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        await swapIntern(data);
        await onHandleGetOrder();
        reset();
        onClose();
        enqueueSnackbar('Update success!');
        // console.info('Trade Union', tradeUnionSelect);
        // console.info('Company', companySelect);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset, swapIntern, onHandleGetOrder]
  );

  // useEffect(() => {
  //   if (currentContact && currentIntern) {
  //     reset({
  //       // name: currentIntern.name || '',
  //       address: currentContact.address || '',
  //       email: currentContact.email || '',
  //       phone: currentContact.phone || '',
  //       addressDadAndMom: currentContact.addressDadAndMom || '',
  //       phoneDad: currentContact.phoneDad || '',
  //       phoneMom: currentContact.phoneMom || '',
  //     });
  //   }
  // }, [currentContact, currentIntern, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 360 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Cập nhập số thứ tự thực tập sinh</DialogTitle>

        <DialogContent>
          {/* <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Thông tin thực tập sinh: {currentIntern?.name}
          </Alert> */}

          <Box
            rowGap={3}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <RHFTextField name="newIndex" label="Số Thứ Tự" type="number" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Cập Nhập
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
