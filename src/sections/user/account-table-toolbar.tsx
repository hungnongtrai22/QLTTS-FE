import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// locales
import { useLocales } from 'src/locales';
// types
import { IAccountTableFilters } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: IAccountTableFilters;
  onFilters: (name: string, value: string) => void;
};

export default function AccountTableToolbar({ filters, onFilters }: Props) {
  const { t } = useLocales();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder={t('account_search_placeholder') || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
