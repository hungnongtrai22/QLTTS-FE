import { saveAs } from 'file-saver';
// Chỉ lấy kiểu: thư viện ExcelJS nạp động trong hàm.
import type { DataValidation } from 'exceljs';
//
import { learningProcess as learningProcessList } from './learningProcess';
import { characteristicList } from './characteristic';

// ----------------------------------------------------------------------
// Phiếu nhập điểm Excel cho giáo viên (trang Báo cáo học tập → "Phiếu nhập điểm").
//
// Xuất: mỗi TTS một dòng, điền sẵn báo cáo tháng này (nếu đã có, chưa công khai) hoặc gợi ý từ
// tháng trước. Giáo viên điền điểm + nhận xét rồi gửi lại; admin nhập file ở cùng trang, xem
// trước rồi lưu qua study/updateBulk (không công khai) — xem study-score-sheet-utils.ts.
//
// Cách đọc lại file không dựa vào vị trí cột: dòng 3 (ẩn) ghi khóa của từng cột, cột A (ẩn) là id
// TTS, cột B (ẩn) là updatedAt của báo cáo lúc xuất. Sheet ẩn "meta" ghi phiên bản mẫu và tháng.
// ExcelJS (~1MB) và html-to-text nạp động lúc bấm, không nằm trong bundle của trang.
// ----------------------------------------------------------------------

export const SCORE_SHEET_VERSION = 'qltts-score-sheet-v1';

const DATA_SHEET = '点数入力';
const GUIDE_SHEET = '説明 Hướng dẫn';
const LIST_SHEET = 'lists';
const META_SHEET = 'meta';

const KEY_ROW = 3;
const HEAD_ROW = 4;
const FIRST_ROW = 5;

const COMMENT_MAX = 300;

type ColumnKind =
  | 'hidden'
  | 'no'
  | 'info'
  | 'score'
  | 'read'
  | 'jlpt'
  | 'level'
  | 'list'
  | 'comment';

type ListName = 'learningProcess' | 'characteristic' | 'teacher';

type SheetColumn = {
  key: string;
  header: string;
  width: number;
  kind: ColumnKind;
  list?: ListName;
  // Ô bắt buộc: còn trống thì tô vàng
  required?: boolean;
};

// Thứ tự 10 mục điểm giống bản in (B) đánh giá chung 6 mục, (C) kỹ năng tiếng Nhật 4 mục.
const COLUMNS: SheetColumn[] = [
  { key: 'internId', header: 'internId', width: 4, kind: 'hidden' },
  { key: 'base', header: 'base', width: 4, kind: 'hidden' },
  { key: 'no', header: 'No.', width: 5, kind: 'no' },
  { key: 'name', header: '氏名\nHọ tên', width: 26, kind: 'info' },
  { key: 'namejp', header: 'フリガナ\nKatakana', width: 22, kind: 'info' },
  { key: 'studyClass', header: 'クラス\nLớp', width: 14, kind: 'info' },
  { key: 'state', header: '状態\nTrạng thái', width: 16, kind: 'info' },
  { key: 'health', header: '健康状態\nSức khỏe', width: 9, kind: 'score', required: true },
  { key: 'cooperation', header: '協調性\nHợp tác', width: 9, kind: 'score', required: true },
  { key: 'attend', header: '出席状況\nChuyên cần', width: 10, kind: 'score', required: true },
  { key: 'discipline', header: '規律厳守\nKỷ luật', width: 9, kind: 'score', required: true },
  { key: 'attitude', header: '学習態度\nThái độ', width: 9, kind: 'score', required: true },
  {
    key: 'acquiringKnowledge',
    header: '知識の取得度\nTiếp thu',
    width: 11,
    kind: 'score',
    required: true,
  },
  { key: 'write', header: '筆記力\nViết', width: 8, kind: 'score', required: true },
  {
    key: 'read',
    header: '読解力（10点刻み）\nĐọc hiểu (÷10)',
    width: 12,
    kind: 'read',
    required: true,
  },
  { key: 'listen', header: '聴解力\nNghe', width: 8, kind: 'score', required: true },
  { key: 'speak', header: '会話力\nNói', width: 8, kind: 'score', required: true },
  { key: 'kanji', header: '模試 文字・語彙\nJLPT Từ vựng', width: 12, kind: 'jlpt' },
  {
    key: 'grammarAndReading',
    header: '模試 文法・読解\nJLPT Ngữ pháp·Đọc',
    width: 13,
    kind: 'jlpt',
  },
  { key: 'listeningComprehension', header: '模試 聴解\nJLPT Nghe', width: 11, kind: 'jlpt' },
  { key: 'level', header: 'JLPTレベル\nTrình độ', width: 11, kind: 'level', required: true },
  {
    key: 'learningProcess',
    header: '学習進捗\nTiến độ',
    width: 20,
    kind: 'list',
    list: 'learningProcess',
    required: true,
  },
  {
    key: 'characteristic',
    header: '性格\nTính cách',
    width: 22,
    kind: 'list',
    list: 'characteristic',
    required: true,
  },
  { key: 'teacher', header: '担当教師\nGiáo viên', width: 20, kind: 'list', list: 'teacher' },
  {
    key: 'comment',
    header: 'コメント（日本語・300字まで）\nNhận xét (tiếng Nhật, tối đa 300 ký tự)',
    width: 60,
    kind: 'comment',
    required: true,
  },
];

// Các cột người nhập điền (đọc lại khi nhập file).
export const SCORE_SHEET_INPUT_KEYS = COLUMNS.filter((column) =>
  ['score', 'read', 'jlpt', 'level', 'list', 'comment'].includes(column.kind)
).map((column) => column.key);

export type ScoreSheetState = 'missing' | 'draft';

export type ScoreSheetItem = {
  internId: string;
  // updatedAt của báo cáo tháng này lúc xuất ('' = chưa có báo cáo)
  base: string;
  name: string;
  namejp: string;
  studyClass: string;
  state: ScoreSheetState;
  // Điểm / chữ điền sẵn; comment là HTML của trình soạn thảo
  values: Record<string, string | number | null>;
};

export type ScoreSheetMeta = {
  // YYYY-MM
  month: string;
  // Mô tả phạm vi (lớp / giáo viên / …) cho dòng 2 và tên file; rỗng = tất cả
  scope: string;
  teachers: string[];
};

const THIN = { style: 'thin' as const, color: { argb: 'FFC4CDD5' } };
const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };
const fill = (argb: string) => ({
  type: 'pattern' as const,
  pattern: 'solid' as const,
  fgColor: { argb },
});
const HEAD_FILL = fill('FFA6E3E9'); // cùng màu tiêu đề với mẫu báo cáo PDF / Excel
const INFO_FILL = fill('FFF4F6F8');
const REQUIRED_FILL = fill('FFFFF3C4');

const STATE_TEXT: Record<ScoreSheetState, string> = {
  missing: '未入力 / Chưa nhập',
  draft: '下書き / Chưa công khai',
};

const monthTexts = (month: string) => {
  const [year, monthNo] = month.split('-');
  return { jp: `${year}年${Number(monthNo)}月分`, vi: `tháng ${Number(monthNo)}/${year}` };
};

const GUIDE_LINES: Array<[string, string]> = [
  [
    'Chỉ nhập vào ô nền trắng. Ô nền xám (tên, lớp, trạng thái) chỉ để xem.',
    '白いセルだけ入力してください。灰色のセル（氏名・クラス・状態）は参照用です。',
  ],
  [
    '10 mục điểm: số nguyên từ 0 đến 100. Riêng Đọc hiểu phải chia hết cho 10.',
    '評価10項目：0〜100の整数。読解力は10点刻みです。',
  ],
  [
    'Thi thử JLPT không bắt buộc: 0–60 điểm, không thi thì để trống.',
    'JLPT模試は任意：0〜60点。受けていない場合は空欄にしてください。',
  ],
  [
    'Trình độ, tiến độ, tính cách, giáo viên đã điền sẵn theo tháng trước — kiểm tra và sửa nếu cần.',
    'レベル・学習進捗・性格・担当教師は前月の内容が入っています。必要に応じて修正してください。',
  ],
  [
    'Nhận xét viết bằng tiếng Nhật, bắt buộc, tối đa 300 ký tự.',
    'コメントは日本語で入力してください（必須・300字まで）。',
  ],
  [
    'Ô tô vàng là ô bắt buộc còn trống. Dòng thiếu ô bắt buộc sẽ chưa được lưu.',
    '黄色のセルは未入力の必須項目です。必須項目が空欄の行は保存されません。',
  ],
  [
    'Không thêm, xoá hay đổi thứ tự cột; không đổi tên sheet. Sắp xếp lại dòng thì được.',
    '列の追加・削除・並べ替え、シート名の変更はしないでください（行の並べ替えは可）。',
  ],
  [
    'Nhập xong gửi lại file cho quản lý. Điểm được lưu ở trạng thái chưa công khai.',
    '入力後、ファイルを管理者に返送してください。報告は非公開の状態で保存されます。',
  ],
];

export const scoreSheetFileName = (meta: ScoreSheetMeta) => {
  const scope = (meta.scope || 'Tất cả').replace(/[\\/:*?"<>|]+/g, ' ').trim();
  return `Phiếu nhập điểm ${meta.month} - ${scope}.xlsx`;
};

export async function exportScoreSheet(items: ScoreSheetItem[], meta: ScoreSheetMeta) {
  const [{ default: ExcelJS }, { htmlToText }] = await Promise.all([
    import('exceljs'),
    import('html-to-text'),
  ]);

  const toText = (html: string) => htmlToText(html, { wordwrap: false }).trim();
  const months = monthTexts(meta.month);

  const workbook = new ExcelJS.Workbook();

  // ---- Sheet nhập điểm
  const sheet = workbook.addWorksheet(DATA_SHEET, {
    views: [{ state: 'frozen', xSplit: 5, ySplit: HEAD_ROW }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  sheet.columns = COLUMNS.map((column) => ({ width: column.width }));
  sheet.getColumn(1).hidden = true;
  sheet.getColumn(2).hidden = true;

  const lastCol = COLUMNS.length;
  const lastRow = FIRST_ROW + Math.max(items.length, 1) - 1;
  const colOf = (key: string) => COLUMNS.findIndex((column) => column.key === key) + 1;
  const letter = (key: string) => sheet.getColumn(colOf(key)).letter;

  sheet.mergeCells(1, 3, 1, lastCol);
  const title = sheet.getCell(1, 3);
  title.value = `学習報告 点数入力シート（${months.jp}）／ Phiếu nhập điểm ${months.vi}`;
  title.font = { bold: true, size: 14 };

  sheet.mergeCells(2, 3, 2, lastCol);
  const scopeCell = sheet.getCell(2, 3);
  scopeCell.value = [
    meta.scope && `範囲 / Phạm vi: ${meta.scope}`,
    `人数 / Số TTS: ${items.length}`,
    `出力日 / Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
    '入力方法は「説明 Hướng dẫn」シート / Cách nhập: xem sheet "説明 Hướng dẫn"',
  ]
    .filter(Boolean)
    .join('　／　');
  scopeCell.font = { size: 10, color: { argb: 'FF637381' } };

  // Dòng khóa (ẩn): đọc lại file theo khóa, không theo vị trí cột.
  const keyRow = sheet.getRow(KEY_ROW);
  COLUMNS.forEach((column, index) => {
    keyRow.getCell(index + 1).value = column.key;
  });
  keyRow.hidden = true;

  const header = sheet.getRow(HEAD_ROW);
  COLUMNS.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.value = column.header;
    cell.font = { bold: true, size: 10 };
    cell.fill = HEAD_FILL;
    cell.border = BORDER;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  header.height = 46;

  items.forEach((item, index) => {
    const row = sheet.getRow(FIRST_ROW + index);
    COLUMNS.forEach((column, col) => {
      const cell = row.getCell(col + 1);
      let value: string | number | null;
      switch (column.key) {
        case 'internId':
          value = item.internId;
          break;
        case 'base':
          value = item.base;
          break;
        case 'no':
          value = index + 1;
          break;
        case 'name':
        case 'namejp':
        case 'studyClass':
          value = item[column.key] || '';
          break;
        case 'state':
          value = STATE_TEXT[item.state];
          break;
        case 'comment':
          value = toText(String(item.values.comment || ''));
          break;
        default:
          value = item.values[column.key] ?? null;
      }
      cell.value = value;
      cell.border = BORDER;
      const editable = !['hidden', 'no', 'info'].includes(column.kind);
      if (!editable) {
        cell.fill = INFO_FILL;
        cell.font = { color: { argb: 'FF454F5B' } };
      }
      cell.alignment = {
        vertical: 'top',
        horizontal: ['score', 'read', 'jlpt', 'level', 'no'].includes(column.kind)
          ? 'center'
          : 'left',
        wrapText: column.kind === 'comment' || column.kind === 'list',
      };
    });
    // Excel không tự giãn dòng khi mở file do thư viện tạo: ước lượng theo độ dài nhận xét.
    const comment = String(row.getCell(colOf('comment')).value || '');
    row.height = Math.max(24, Math.ceil(comment.length / 30) * 15);
  });

  // ---- Danh sách gợi ý cho ô chọn (sheet ẩn)
  const lists = workbook.addWorksheet(LIST_SHEET, { state: 'veryHidden' });
  const listValues: Record<ListName, string[]> = {
    learningProcess: learningProcessList,
    characteristic: Array.from(new Set(characteristicList)),
    teacher: meta.teachers.length ? meta.teachers : [''],
  };
  const listRange: Record<ListName, string> = {} as Record<ListName, string>;
  (['learningProcess', 'characteristic', 'teacher'] as ListName[]).forEach((name, index) => {
    const col = index + 1;
    listValues[name].forEach((value, rowIndex) => {
      lists.getCell(rowIndex + 1, col).value = value;
    });
    const colLetter = lists.getColumn(col).letter;
    listRange[name] = `${LIST_SHEET}!$${colLetter}$1:$${colLetter}$${listValues[name].length}`;
  });

  // ---- Kiểm tra dữ liệu ngay trong Excel (giáo viên thấy lỗi lúc gõ)
  // ExcelJS 4.4 có worksheet.dataValidations (thêm theo cả vùng ô) nhưng index.d.ts chưa khai báo.
  const { dataValidations } = sheet as unknown as {
    dataValidations: { add: (ref: string, validation: DataValidation) => void };
  };
  const range = (key: string) => `${letter(key)}${FIRST_ROW}:${letter(key)}${lastRow}`;
  const message = (error: string) => ({
    showErrorMessage: true,
    errorStyle: 'stop' as const,
    errorTitle: '入力エラー / Sai dữ liệu',
    error,
  });

  COLUMNS.forEach((column) => {
    const ref = range(column.key);
    const top = `${letter(column.key)}${FIRST_ROW}`;
    if (column.kind === 'score') {
      dataValidations.add(ref, {
        type: 'whole',
        operator: 'between',
        allowBlank: true,
        formulae: [0, 100],
        ...message('0〜100の整数 / Số nguyên từ 0 đến 100'),
      });
    } else if (column.kind === 'read') {
      dataValidations.add(ref, {
        type: 'custom',
        allowBlank: true,
        formulae: [`AND(ISNUMBER(${top}),MOD(${top},10)=0,${top}>=0,${top}<=100)`],
        ...message('0〜100、10点刻み / 0–100, chia hết cho 10'),
      });
    } else if (column.kind === 'jlpt') {
      dataValidations.add(ref, {
        type: 'whole',
        operator: 'between',
        allowBlank: true,
        formulae: [0, 60],
        ...message('0〜60の整数（任意） / Số nguyên 0–60 (không bắt buộc)'),
      });
    } else if (column.kind === 'level') {
      dataValidations.add(ref, {
        type: 'list',
        allowBlank: true,
        formulae: ['"N5,N4,N3,N2,N1"'],
        ...message('N5〜N1から選んでください / Chọn N5–N1'),
      });
    } else if (column.kind === 'list' && column.list) {
      // Gợi ý để chọn nhanh, vẫn cho gõ chữ khác.
      dataValidations.add(ref, {
        type: 'list',
        allowBlank: true,
        formulae: [listRange[column.list]],
        showErrorMessage: false,
      });
    } else if (column.kind === 'comment') {
      dataValidations.add(ref, {
        type: 'textLength',
        operator: 'lessThanOrEqual',
        allowBlank: true,
        formulae: [COMMENT_MAX],
        ...message('300字まで / Tối đa 300 ký tự'),
      });
    }

    // Ô bắt buộc còn trống: tô vàng.
    if (column.required && items.length) {
      sheet.addConditionalFormatting({
        ref,
        rules: [
          {
            type: 'expression',
            priority: 1,
            formulae: [`LEN(TRIM(${top}))=0`],
            style: { fill: REQUIRED_FILL },
          },
        ],
      });
    }
  });

  // ---- Hướng dẫn
  const guide = workbook.addWorksheet(GUIDE_SHEET);
  guide.columns = [{ width: 4 }, { width: 90 }];
  guide.getCell('B1').value = `Phiếu nhập điểm ${months.vi} / 点数入力シート（${months.jp}）`;
  guide.getCell('B1').font = { bold: true, size: 14 };
  GUIDE_LINES.forEach(([vi, jp], index) => {
    const row = guide.getRow(3 + index * 2);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = vi;
    guide.getRow(4 + index * 2).getCell(2).value = jp;
    guide.getRow(4 + index * 2).getCell(2).font = { color: { argb: 'FF637381' } };
  });

  // ---- Thông tin để đọc lại file (sheet ẩn)
  const metaSheet = workbook.addWorksheet(META_SHEET, { state: 'veryHidden' });
  metaSheet.getCell('A1').value = 'version';
  metaSheet.getCell('B1').value = SCORE_SHEET_VERSION;
  metaSheet.getCell('A2').value = 'month';
  metaSheet.getCell('B2').value = meta.month;
  metaSheet.getCell('A3').value = 'exportedAt';
  metaSheet.getCell('B3').value = new Date().toISOString();

  // Mở file là thấy sheet nhập điểm.
  workbook.views = [
    { x: 0, y: 0, width: 20000, height: 12000, firstSheet: 0, activeTab: 0, visibility: 'visible' },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    scoreSheetFileName(meta)
  );
}

// ----------------------------------------------------------------------
// Đọc lại phiếu

export type ScoreSheetCell = string | number | null;

export type ScoreSheetRecord = {
  // Số dòng trong Excel (để báo lỗi đúng dòng)
  rowNumber: number;
  internId: string;
  base: string;
  name: string;
  cells: Record<string, ScoreSheetCell>;
};

export type ScoreSheetErrorCode = 'unreadable' | 'not_template' | 'no_rows';

export class ScoreSheetError extends Error {
  code: ScoreSheetErrorCode;

  constructor(code: ScoreSheetErrorCode) {
    super(code);
    this.code = code;
  }
}

// Giá trị ô ExcelJS → chữ / số (ô công thức lấy kết quả, chữ định dạng thì ghép lại).
const cellValue = (value: any): ScoreSheetCell => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' || typeof value === 'string') return value;
  if (typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    if ('result' in value) return cellValue(value.result);
    if (Array.isArray(value.richText)) return value.richText.map((part: any) => part.text).join('');
    if ('text' in value) return String(value.text);
  }
  return String(value);
};

const cellText = (value: any) => {
  const raw = cellValue(value);
  return raw === null ? '' : String(raw).trim();
};

export async function readScoreSheet(
  file: File
): Promise<{ month: string; records: ScoreSheetRecord[] }> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch (error) {
    throw new ScoreSheetError('unreadable');
  }

  const meta = workbook.getWorksheet(META_SHEET);
  const sheet = workbook.getWorksheet(DATA_SHEET);
  const month = meta ? cellText(meta.getCell('B2').value) : '';
  if (!meta || !sheet || cellText(meta.getCell('B1').value) !== SCORE_SHEET_VERSION) {
    throw new ScoreSheetError('not_template');
  }
  if (!/^\d{4}-\d{2}$/.test(month)) throw new ScoreSheetError('not_template');

  const colByKey: Record<string, number> = {};
  sheet.getRow(KEY_ROW).eachCell((cell, col) => {
    const key = cellText(cell.value);
    if (key) colByKey[key] = col;
  });
  if (!colByKey.internId || SCORE_SHEET_INPUT_KEYS.some((key) => !colByKey[key])) {
    throw new ScoreSheetError('not_template');
  }

  const records: ScoreSheetRecord[] = [];
  for (let rowNumber = FIRST_ROW; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const internId = cellText(row.getCell(colByKey.internId).value);
    if (internId) {
      const cells: Record<string, ScoreSheetCell> = {};
      SCORE_SHEET_INPUT_KEYS.forEach((key) => {
        const raw = cellValue(row.getCell(colByKey[key]).value);
        cells[key] = typeof raw === 'string' ? raw.replace(/\r\n?/g, '\n') : raw;
      });
      records.push({
        rowNumber,
        internId,
        base: colByKey.base ? cellText(row.getCell(colByKey.base).value) : '',
        name: colByKey.name ? cellText(row.getCell(colByKey.name).value) : '',
        cells,
      });
    }
  }

  if (!records.length) throw new ScoreSheetError('no_rows');

  return { month, records };
}
