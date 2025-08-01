// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IInternTableFilters, IUserTableFilterValue } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IInternTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

function changeTextStatus(value: any) {
  if (value === 'study') {
    return 'Đang học';
  }
  if (value === 'pass') {
    return 'Đã xuất cảnh';
  }
  if (value === 'complete') {
    return 'Hoàn thành hợp đồng';
  }
  return '';
}

export default function InternTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveRole = (inputValue: string) => {
    const newValue = filters.tradeUnion.filter((item) => item !== inputValue);
    onFilters('tradeUnion', newValue);
  };

  const handleRemoveCompany = (inputValue: string) => {
    const newValue = filters?.company?.filter((item) => item !== inputValue) || [];
    onFilters('company', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {' '}
          thực tập sinh được tìm thấy
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Trạng thái:">
            <Chip
              size="small"
              label={changeTextStatus(filters.status)}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.tradeUnion.length && (
          <Block label="Nghiệp đoàn:">
            {filters.tradeUnion.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveRole(item)} />
            ))}
          </Block>
        )}

        {!!filters.company?.length && (
          <Block label="Công ty:">
            {filters.company.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveCompany(item)} />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Xoá
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
