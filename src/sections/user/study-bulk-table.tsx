import { useCallback, useRef } from 'react';
// @mui
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyBulkRow, IStudyScoreKey } from 'src/types/user';
// components
import Scrollbar from 'src/components/scrollbar';
import { TableNoData, TableSkeleton } from 'src/components/table';
//
import StudyBulkTableRow from './study-bulk-table-row';
import { BulkEntry, BulkFieldKey, isLocked } from './study-bulk-utils';

// ----------------------------------------------------------------------

type Props = {
  rows: IStudyBulkRow[];
  work: Record<string, BulkEntry>;
  saveErrors: Record<string, string>;
  // Dòng báo cáo đã công khai được người nhập mở khóa trong phiên này
  unlocked: Record<string, boolean>;
  onUnlock: (id: string) => void;
  loading: boolean;
  scoreLabels: string[];
  onScore: (id: string, key: IStudyScoreKey, raw: string) => void;
  onField: (id: string, key: BulkFieldKey, value: string | number | null) => void;
  onOpenDetail: (id: string) => void;
  onPasteBlock: (rowIndex: number, colIndex: number, text: string) => void;
};

const headCell = { py: 1, px: 0.5, whiteSpace: 'nowrap', typography: 'caption', fontWeight: 600 };

export default function StudyBulkTable({
  rows,
  work,
  saveErrors,
  unlocked,
  onUnlock,
  loading,
  scoreLabels,
  onScore,
  onField,
  onOpenDetail,
  onPasteBlock,
}: Props) {
  const { t } = useLocales();

  // Ô điểm theo vị trí "dòng-cột" để Enter / ↑ / ↓ nhảy dòng như bảng tính.
  const inputs = useRef(new Map<string, HTMLInputElement>());

  const registerInput = useCallback(
    (rowIndex: number, colIndex: number, el: HTMLInputElement | null) => {
      const key = `${rowIndex}-${colIndex}`;
      if (el) inputs.current.set(key, el);
      else inputs.current.delete(key);
    },
    []
  );

  const handleNavigate = useCallback((rowIndex: number, colIndex: number, step: number) => {
    const next = inputs.current.get(`${rowIndex + step}-${colIndex}`);
    if (next) {
      next.focus();
      next.select();
    }
  }, []);

  return (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <Scrollbar>
        <Table size="small" sx={{ minWidth: 1040 }}>
          <TableHead>
            <TableRow>
              <TableCell
                rowSpan={2}
                sx={{ position: 'sticky', left: 0, zIndex: 2, minWidth: 190, pl: 2.5 }}
              >
                {t('study_report_col_intern')}
              </TableCell>
              <TableCell colSpan={6} align="center" sx={{ ...headCell, pb: 0.5 }}>
                {t('study_bulk_group_b')}
              </TableCell>
              <TableCell colSpan={4} align="center" sx={{ ...headCell, pb: 0.5 }}>
                {t('study_bulk_group_c')}
              </TableCell>
              <TableCell rowSpan={2} align="center" sx={{ ...headCell, width: 72 }}>
                {t('study_report_col_total')}
              </TableCell>
              <TableCell rowSpan={2} sx={{ ...headCell, width: 76, px: 1 }}>
                {t('study_bulk_col_level')}
              </TableCell>
              <TableCell rowSpan={2} align="center" sx={{ ...headCell, width: 56 }}>
                {t('study_bulk_col_detail')}
              </TableCell>
              <TableCell rowSpan={2} sx={{ ...headCell, width: 150, pl: 1 }}>
                {t('status')}
              </TableCell>
            </TableRow>
            <TableRow>
              {scoreLabels.map((label) => (
                <TableCell
                  key={label}
                  align="center"
                  // Nhãn dài (Chuyên cần, Sức khỏe…) xuống 2 dòng thay vì đẩy cột rộng ra.
                  sx={{ ...headCell, width: 50, whiteSpace: 'normal', lineHeight: 1.3 }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => <TableSkeleton key={index} />)
              : rows.map((row, rowIndex) => (
                  <StudyBulkTableRow
                    key={row._id}
                    row={row}
                    entry={work[row._id]}
                    saveError={saveErrors[row._id]}
                    locked={isLocked(row, unlocked)}
                    onUnlock={onUnlock}
                    rowIndex={rowIndex}
                    scoreLabels={scoreLabels}
                    onScore={onScore}
                    onField={onField}
                    onOpenDetail={onOpenDetail}
                    onPasteBlock={onPasteBlock}
                    onNavigate={handleNavigate}
                    registerInput={registerInput}
                  />
                ))}

            <TableNoData notFound={!loading && !rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
