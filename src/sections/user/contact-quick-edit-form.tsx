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
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// routes
// _mock
// types
import { IContactItem, IInternItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {  RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IContactItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentIntern?: IInternItem;
};

export default function ContactQuickEditForm({ currentIntern, open, onClose }: Props) {
  // console.log(currentIntern);
  const { enqueueSnackbar } = useSnackbar();
  const [currentContact, setCurrentContact] = useState<any>();

  // console.log(currentContact);

  const NewUserSchema = Yup.object().shape({});

  const handleGetContactByInternId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/contact/getByInternId`,
      { internId: currentIntern?._id }
    );
    setCurrentContact(data.contact);
  }, [currentIntern]);

  const defaultValues = useMemo(
    () => ({
      name: currentIntern?.name || '',
      address: currentContact?.address || '',
      email: currentContact?.email || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIntern, currentContact]
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

  const editContact = useCallback(
    async (contact: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/contact/edit`, {
        _id: currentContact._id,
        internId: currentContact.internId,
        ...contact,
      });
      return data;
    },
    [currentContact]
  );

  const createContact = useCallback(
    async (contact: any) => {
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/contact/create`, {
        internId: currentIntern?._id,
        ...contact,
      });
      return data;
    },
    [currentIntern]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (currentContact) {
          await editContact(data);
        } else {
          await createContact(data);
        }
        reset();
        onClose();
        enqueueSnackbar(currentContact ? 'Update success!' : 'Create success!');
        // console.info('Trade Union', tradeUnionSelect);
        // console.info('Company', companySelect);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset, editContact, createContact, currentContact]
  );

  useEffect(() => {
    handleGetContactByInternId();
  }, [handleGetContactByInternId]);

  useEffect(() => {
    if (currentContact && currentIntern) {
      reset({
        // name: currentIntern.name || '',
        address: currentContact.address || '',
        email: currentContact.email || '',
        phone: currentContact.phone || '',
        addressDadAndMom: currentContact.addressDadAndMom || '',
        phoneDad: currentContact.phoneDad || '',
        phoneMom: currentContact.phoneMom || '',
      });
    }
  }, [currentContact, currentIntern, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Cập nhập thông tin liên lạc</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Thông tin thực tập sinh: {currentIntern?.name}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="address" label="Địa chỉ" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="phone" label="Số điện thoại" />
          </Box>

          <Alert variant="outlined" severity="info" sx={{ mb: 3, mt: 3 }}>
            Thông tin bố:{' '}
            {currentIntern?.family?.find((item: any) => item.relationship === '姉')?.name} và Thông
            tin mẹ: {currentIntern?.family?.find((item: any) => item.relationship === '兄')?.name}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="addressDadAndMom" label="Địa chỉ" />
            <RHFTextField name="phoneDad" label="Số điện thoại bố" />
            <RHFTextField name="phoneMom" label="Số điện thoại mẹ" />
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
