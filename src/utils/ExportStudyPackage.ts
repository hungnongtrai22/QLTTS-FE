import { saveAs } from 'file-saver';
// types
import { IStudyPackageItem, IStudyPackageMeta } from 'src/types/user';
//
import { evaluateStudent, normalizeName } from './studyGrade';

// ----------------------------------------------------------------------
// Gói báo cáo học tập gửi đối tác — bản Excel: một sheet, mỗi TTS một dòng (đủ 10 mục điểm và
// nhận xét). Nhãn cột tiếng Nhật, cùng cách gọi với mẫu PDF báo cáo (intern-pdf-study.tsx).
// ExcelJS (~1MB) và html-to-text nạp động lúc bấm xuất, không nằm trong bundle của trang.
// ----------------------------------------------------------------------

type Column = {
  header: string;
  width: number;
  value: (item: IStudyPackageItem, index: number) => string | number | null;
  center?: boolean;
  wrap?: boolean;
};

const score = (key: string) => (item: IStudyPackageItem) => {
  const value = item.report[key];
  return typeof value === 'number' ? value : null;
};

const total = (item: IStudyPackageItem) => Number(item.report.total) || 0;

const buildColumns = (toText: (html: string) => string): Column[] => [
  { header: 'No.', width: 5, center: true, value: (item, index) => index + 1 },
  { header: '実習生の氏名', width: 26, value: (item) => normalizeName(item.intern.name || '') },
  { header: 'フリガナ', width: 24, value: (item) => item.intern.namejp || '' },
  {
    header: '組合・管理団体',
    width: 24,
    wrap: true,
    value: (item) => item.intern.tradeUnion?.name || '',
  },
  {
    header: '受け入れ企業',
    width: 24,
    wrap: true,
    value: (item) => item.intern.companySelect?.name || '',
  },
  { header: '学習期間(ヶ月)', width: 9, center: true, value: score('time') },
  { header: '健康状態', width: 8, center: true, value: score('health') },
  { header: '協調性', width: 8, center: true, value: score('cooperation') },
  { header: '出席状況', width: 8, center: true, value: score('attend') },
  { header: '規律厳守', width: 8, center: true, value: score('discipline') },
  { header: '学習態度', width: 8, center: true, value: score('attitude') },
  { header: '知識の取得度', width: 9, center: true, value: score('acquiringKnowledge') },
  { header: '筆記力', width: 8, center: true, value: score('write') },
  { header: '読解力', width: 8, center: true, value: score('read') },
  { header: '聴解力', width: 8, center: true, value: score('listen') },
  { header: '会話力', width: 8, center: true, value: score('speak') },
  { header: '合計点(1000)', width: 10, center: true, value: total },
  {
    header: '前月比',
    width: 8,
    center: true,
    value: (item) => (item.prevTotal === null ? null : total(item) - item.prevTotal),
  },
  {
    header: '総合評価',
    width: 8,
    center: true,
    value: ({ report }) =>
      evaluateStudent(
        report.discipline,
        report.attitude,
        report.health,
        report.cooperation,
        report.attend,
        Number(report.total) || 0
      ),
  },
  { header: 'JLPTレベル', width: 9, center: true, value: (item) => item.report.level || '' },
  { header: '学習進捗', width: 20, value: (item) => item.report.learningProcess || '' },
  { header: '性格', width: 20, wrap: true, value: (item) => item.report.characteristic || '' },
  { header: '担当教師', width: 18, value: (item) => item.report.teacher || '' },
  { header: 'コメント', width: 70, wrap: true, value: (item) => toText(item.report.comment || '') },
];

const THIN = { style: 'thin' as const, color: { argb: 'FF9E9E9E' } };
const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };
const HEAD_FILL = {
  type: 'pattern' as const,
  pattern: 'solid' as const,
  fgColor: { argb: 'FFA6E3E9' }, // cùng màu ô tiêu đề của mẫu PDF
};

const jpMonth = (month: string) => {
  const [year, monthNo] = month.split('-');
  return `${year}年${Number(monthNo)}月分`;
};

// Tên file: 学習報告_2026-09_<công ty / nghiệp đoàn>.xlsx — bỏ ký tự Windows không cho phép.
export const studyPackageFileName = (meta: IStudyPackageMeta, extension: 'pdf' | 'xlsx') => {
  const scope = (meta.company || meta.tradeUnion || '全体').replace(/[\\/:*?"<>|]+/g, ' ').trim();
  return `学習報告_${meta.month}_${scope}.${extension}`;
};

export async function exportStudyPackageExcel(items: IStudyPackageItem[], meta: IStudyPackageMeta) {
  const [{ default: ExcelJS }, { htmlToText }] = await Promise.all([
    import('exceljs'),
    import('html-to-text'),
  ]);

  const toText = (html: string) => htmlToText(html, { wordwrap: false }).trim();
  const columns = buildColumns(toText);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('学習報告', {
    views: [{ state: 'frozen', xSplit: 3, ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  sheet.columns = columns.map((column) => ({ width: column.width }));

  // Dòng 1–2: tiêu đề + phạm vi gói
  sheet.mergeCells(1, 1, 1, columns.length);
  const title = sheet.getCell(1, 1);
  title.value = `技能実習生事前教育評価表 一覧（${jpMonth(meta.month)}）`;
  title.font = { bold: true, size: 14 };

  const scope = [
    meta.tradeUnion && `組合・管理団体：${meta.tradeUnion}様`,
    meta.company && `受け入れ企業：${meta.company}様`,
    '報告機関：NHAT TAN 人材育成・提供有限会社 教育部',
    `人数：${items.length}名`,
  ]
    .filter(Boolean)
    .join('　／　');
  sheet.mergeCells(2, 1, 2, columns.length);
  sheet.getCell(2, 1).value = scope;
  sheet.getCell(2, 1).font = { size: 10, color: { argb: 'FF637381' } };

  // Dòng 4: tiêu đề cột
  const header = sheet.getRow(4);
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.value = column.header;
    cell.font = { bold: true };
    cell.fill = HEAD_FILL;
    cell.border = BORDER;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  header.height = 32;

  items.forEach((item, index) => {
    const row = sheet.getRow(5 + index);
    columns.forEach((column, col) => {
      const cell = row.getCell(col + 1);
      cell.value = column.value(item, index);
      cell.border = BORDER;
      cell.alignment = {
        vertical: 'top',
        horizontal: column.center ? 'center' : 'left',
        wrapText: !!column.wrap,
      };
    });
    // Nhận xét dài (tối đa 300 chữ): ước lượng số dòng cho vừa ô — Excel không tự giãn dòng
    // khi mở file do thư viện tạo ra.
    const comment = String(row.getCell(columns.length).value || '');
    row.height = Math.max(20, Math.ceil(comment.length / 34) * 15);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    studyPackageFileName(meta, 'xlsx')
  );
}
