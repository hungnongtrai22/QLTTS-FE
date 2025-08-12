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
import { IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentIntern?: IInternItem;
};

export default function InternQuickEditForm({ currentIntern, open, onClose }: Props) {
  // console.log(currentIntern);
  const { enqueueSnackbar } = useSnackbar();
  const [tradeUnion, setTradeUnion] = useState([]);
  const [tradeUnionSelect, setTradeUnionSelect] = useState(currentIntern?.tradeUnion?._id || '');
  const [company, setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState(currentIntern?.companySelect?._id || '');
  const { t } = useLocales();

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      name: currentIntern?.name || '',
      company: currentIntern?.companySelect?._id || '',
      tradeUnion: currentIntern?.tradeUnion?._id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIntern]
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
  const editIntern = useCallback(async () => {
    const { data } = await axios.put(
      `${process.env.REACT_APP_HOST_API}/api/user/updateTradeUnion`,
      {
        _id: currentIntern?._id,
        tradeUnion: tradeUnionSelect,
        companySelect: companySelect,
      }
    );
    return data;
  }, [currentIntern, tradeUnionSelect, companySelect]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await editIntern();
        reset();
        onClose();
        enqueueSnackbar('Update success!');
        // console.info('Trade Union', tradeUnionSelect);
        // console.info('Company', companySelect);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset, editIntern]
  );

  const handleGetTradeUnion = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/list`);
    setTradeUnion(data.tradeUnions);
  }, []);

  const handleGetCompanyByTradeUnionId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/company/listByTradeUnion`,
      {
        tradeUnion: tradeUnionSelect,
      }
    );
    setCompany(data.companies);
  }, [tradeUnionSelect]);

  useEffect(() => {
    handleGetTradeUnion();
  }, [handleGetTradeUnion]);

  useEffect(() => {
    if (tradeUnionSelect) {
      handleGetCompanyByTradeUnionId();
    }
  }, [tradeUnionSelect, handleGetCompanyByTradeUnionId]);

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
        <DialogTitle>Cập nhập nghiệp đoàn và công ty</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Thực Tập Sinh: {currentIntern?.name}
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
            {/* <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}

            <RHFSelect
              fullWidth
              name="tradeUnion"
              label={t('trade_union')}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              onChange={(event) => {
                setTradeUnionSelect(event.target.value);
              }}
              value={tradeUnionSelect}
            >
              {tradeUnion.map((option: any) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>
            {tradeUnionSelect && company.length > 0 ? (
              <RHFSelect
                fullWidth
                name="company"
                label={t('company_title')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={(event) => {
                  setCompanySelect(event.target.value);
                }}
                value={companySelect}
              >
                {company.map((option: any) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            ) : (
              <p>Không có công ty</p>
            )}
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
