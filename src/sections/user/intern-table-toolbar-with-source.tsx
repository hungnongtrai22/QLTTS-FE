/* eslint-disable no-restricted-syntax, no-await-in-loop */

import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
import { IInternTableFilters, IUserTableFilterValue } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLocales } from 'src/locales';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import axios from 'axios';
import { typeIntern, typeInternJP } from 'src/utils/type';
import { departure } from 'src/utils/departure';
import ExportListInterns from 'src/utils/ExportListInterns';

import AllAttendancePDF from '../order/AllAttendancePDF';

// ----------------------------------------------------------------------

type Props = {
  filters: IInternTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  roleOptions: string[];
  companyOptions: string[];
  interns: any;
  sources: any;
};

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
  return value;
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
  return value;
}

export default function InternTableToolbarWithSource({
  filters,
  onFilters,
  //
  roleOptions,
  companyOptions,
  sources,
  interns,
}: Props) {
  const popover = usePopover();
  // console.log('Interns', interns);
  const [loadingDownloadAll, setLoadingDownloadAll] = useState(false);

  const studyDate = interns[0]?.studyDate;
  const start = studyDate ? new Date(studyDate) : null;

  const result: { month: number; year: number }[] = [];

  if (start) {
    const current = new Date();
    let year = start.getFullYear();
    let month = start.getMonth() + 1; // getMonth() trả về từ 0 đến 11

    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth() + 1;

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
      result.push({ month, year });

      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }

  // console.log(result);

  const { t, currentLang } = useLocales();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRole = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'tradeUnion',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterCompany = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'company',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterSource = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'source',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'type',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

   const handleFilterYear = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'year',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('trade_union')}</InputLabel>

          <Select
            multiple
            value={filters.tradeUnion}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.tradeUnion.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('company_name')}</InputLabel>

          <Select
            multiple
            value={filters.company}
            onChange={handleFilterCompany}
            input={<OutlinedInput label="Company" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {companyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.company?.includes(option) ?? false}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('source')}</InputLabel>

          <Select
            multiple
            value={filters.source}
            onChange={handleFilterSource}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {sources.map((option: any) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters?.source?.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('type')}</InputLabel>

          <Select
            multiple
            value={filters.type}
            onChange={handleFilterType}
            input={<OutlinedInput label="Type" />}
            renderValue={(selected) =>
              selected
                .map((value) =>
                  currentLang.value === 'jp' ? changeTextTypeJP(value) : changeTextTypeVN(value)
                )
                .join(', ')
            }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {(currentLang.value === 'jp' ? typeInternJP : typeIntern).map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters?.type?.includes(option.value)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('departure')}</InputLabel>

          <Select
            multiple
            value={filters.year}
            onChange={handleFilterYear}
            input={<OutlinedInput label="Departure" />}
            renderValue={(selected) =>
              selected
                .map((value) =>
                  value
                )
                .join(', ')
            }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {departure.map((option: any) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters?.year?.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder={t('search') || 'Search'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack> */}
      </Stack>

      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pt: 0,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder={t('search') || 'Search'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        // sx={{ width: 140 }}
      >
        <ExportListInterns interns={interns} name="Danh Sách Thực Tập Sinh" />

        <MenuItem
          // onClick={() => {
          //   popover.onClose();
          // }}
          onClick={async () => {
            try {
              setLoadingDownloadAll(true);
              for (const item of interns) {
                const { data } = await axios.post(
                  `${process.env.REACT_APP_HOST_API}/api/attendance/listByInternId`,
                  {
                    internId: item._id,
                  }
                );
                item.attendances = data.attendances;
                item.statistics = [];
                for (const re of result) {
                  const { data: newData } = await axios.post(
                    `${process.env.REACT_APP_HOST_API}/api/attendance/statistics`,
                    {
                      internId: item._id,
                      month: re.month,
                      year: re.year,
                    }
                  );
                  item.statistics.push(newData);
                }
              }
              const { data: newEvent } = await axios.get(
                `${process.env.REACT_APP_HOST_API}/api/event/listAll`
              );
              // console.log('newEvent', newEvent);
              const blob = await pdf(
                <AllAttendancePDF intern={interns} attendance={result} event={newEvent} />
              ).toBlob();
              saveAs(blob, `All_Attendance.pdf`);
            } catch (error) {
              console.error('Lỗi khi tạo PDF:', error);
            } finally {
              setLoadingDownloadAll(false);
            }
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          {loadingDownloadAll ? t('loading_attendance') : t('download_attendance')}
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem> */}
      </CustomPopover>
    </>
  );
}
