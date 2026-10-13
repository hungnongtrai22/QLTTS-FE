import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// hooks
import { useDebouncedFilter } from 'src/hooks/use-debounced-filter';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyReportFilters, IStudyReportFilterValue } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type MultiFilterKey = 'tradeUnion' | 'company' | 'teacher';

type Props = {
  filters: IStudyReportFilters;
  onFilters: (name: string, value: IStudyReportFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  options: Record<MultiFilterKey, string[]>;
  attentionCount: number;
};

export default function StudyReportTableToolbar({
  filters,
  onFilters,
  canReset,
  onResetFilters,
  options,
  attentionCount,
}: Props) {
  const { t } = useLocales();

  const searchName = useDebouncedFilter(filters.name, (next) => onFilters('name', next));

  const renderMultiSelect = useCallback(
    (key: MultiFilterKey, label: string) => (
      <FormControl key={key} sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={filters[key]}
          onChange={(event) => {
            const { value } = event.target;
            onFilters(key, typeof value === 'string' ? value.split(',') : value);
          }}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
        >
          {options[key].map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters[key].includes(option)} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    [filters, onFilters, options]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'stretch', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1.5 } }}
    >
      {renderMultiSelect('tradeUnion', t('trade_union'))}
      {renderMultiSelect('company', t('company_new'))}
      {renderMultiSelect('teacher', t('teacher'))}

      <TextField
        fullWidth
        value={searchName.value}
        onChange={(event) => searchName.onChange(event.target.value)}
        placeholder={t('study_report_search') || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexShrink={0}>
        <FormControlLabel
          sx={{ mr: 1, whiteSpace: 'nowrap' }}
          control={
            <Switch
              checked={filters.attention}
              onChange={(event) => onFilters('attention', event.target.checked)}
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <span>{t('study_report_attention')}</span>
              <Label color="warning">{attentionCount}</Label>
            </Stack>
          }
        />

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            sx={{ flexShrink: 0, minHeight: 44 }}
          >
            {t('study_report_clear')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
