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
import { t } from 'i18next';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IInternTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

function changeTextStatusVN(value: any) {
  if (value === 'study') {
    return 'Đang học';
  }
  if (value === 'pass') {
    return 'Đã xuất cảnh';
  }
  if (value === 'complete') {
    return 'Hoàn thành hợp đồng';
  }
  if (value === 'soon') {
    return 'Về trước hạn';
  }
  if (value === 'interview') {
    return 'Phỏng Vấn';
  }
  return '';
}

function changeTextStatusJP(value: any) {
  if (value === 'study') {
    return '研修中';
  }
  if (value === 'pass') {
    return '出国済み';
  }
  if (value === 'complete') {
    return '契約満了';
  }
  if (value === 'soon') {
    return '早退';
  }
  if (value === 'interview') {
    return '面接';
  }
  return '';
}

function changeTextTypeVN(value: any) {
  if (value === 'intern') {
    return 'Thực tập sinh';
  }
  if (value === 'intern1year') {
    return 'Thực tập sinh (1 năm)';
  }
  if (value === 'skill') {
    return 'Kỹ năng đặc định';
  }
  if (value === 'engineer') {
    return 'Kỹ sư';
  }
  if (value === 'study') {
    return 'Du học';
  }
  return '';
}

function changeTextTypeJP(value: any) {
  if (value === 'intern') {
    return '技能実習生'; // Thực tập sinh
  }
  if (value === 'intern1year') {
    return '技能実習生（1年）'; // Thực tập sinh (1 năm)
  }
  if (value === 'skill') {
    return '特定技能'; // Kỹ năng đặc định
  }
  if (value === 'engineer') {
    return '技術者'; // Kỹ sư
  }
  if (value === 'study') {
    return '留学生'; // Du học
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
  const { currentLang } = useLocales();

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

    const handleRemoveType = (inputValue: string) => {
    const newValue = filters?.type?.filter((item) => item !== inputValue) || [];
    onFilters('type', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {' '}
          {t('intern_find')}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label={t('status')}>
            <Chip
              size="small"
              label={
                currentLang.value === 'jp'
                  ? changeTextStatusJP(filters.status)
                  : changeTextStatusVN(filters.status)
              }
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.tradeUnion.length && (
          <Block label={t('trade_union')}>
            {filters.tradeUnion.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveRole(item)} />
            ))}
          </Block>
        )}

        {!!filters.company?.length && (
          <Block label={t('company_name')}>
            {filters.company.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveCompany(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.type?.length && (
          <Block label={t('type')}>
            {filters.type.map((item) => (
              <Chip
                key={item}
                label={currentLang.value === 'jp'
                  ? changeTextTypeJP(item)
                  : changeTextTypeVN(item)}
                size="small"
                onDelete={() => handleRemoveType(item)}
              />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          {t('delete')}
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
