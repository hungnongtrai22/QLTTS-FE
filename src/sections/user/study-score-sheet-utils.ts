import { IStudyBulkRow } from 'src/types/user';
// Chỉ lấy kiểu: module phiếu Excel nạp động lúc bấm.
import type { ScoreSheetCell, ScoreSheetItem, ScoreSheetRecord } from 'src/utils/StudyScoreSheet';
//
import {
  SCORE_KEYS,
  JLPT_KEYS,
  BulkValues,
  BulkFieldKey,
  baselineEntry,
  checkValues,
  commentText,
  toPayload,
} from './study-bulk-utils';

// ----------------------------------------------------------------------
// Phiếu nhập điểm Excel: dựng dòng để xuất, và so nội dung file nhập lại với dữ liệu hiện có
// (GET study/bulk) để xem trước. Lưu qua study/updateBulk, publish: false.
//
// Kết quả từng dòng của file:
//   create    — chưa có báo cáo, đủ thông tin → tạo mới
//   update    — có báo cáo chưa công khai, có ô thay đổi, đủ thông tin → cập nhật
//   unchanged — giống hệt báo cáo hiện có
//   empty     — chưa có báo cáo và file chưa điền điểm / nhận xét
//   invalid   — thiếu ô bắt buộc hoặc sai giá trị (cùng quy tắc "đủ mới lưu" với trang
//               Nhập hàng loạt và BE)
//   locked    — báo cáo đã công khai: bị khóa, phiếu Excel không mở khóa được
//   conflict  — báo cáo đã có người lưu sau lúc xuất phiếu: không ghi đè
//   unknown   — TTS không thuộc danh sách của tháng
// ----------------------------------------------------------------------

export type ScoreImportStatus =
  | 'create'
  | 'update'
  | 'unchanged'
  | 'empty'
  | 'invalid'
  | 'locked'
  | 'conflict'
  | 'unknown';

// key = khóa i18n; fields = các ô liên quan (hiển thị bằng nhãn cột)
export type ScoreImportProblem = { key: string; fields?: BulkFieldKey[] };

export type ScoreImportRow = {
  rowNumber: number;
  internId: string;
  name: string;
  namejp: string;
  studyClass: string;
  status: ScoreImportStatus;
  problems: ScoreImportProblem[];
  // Các ô khác báo cáo hiện có (chỉ với update)
  changes: BulkFieldKey[];
  total: number | null;
  currentTotal: number | null;
  payload: ReturnType<typeof toPayload> | null;
};

export const SAVABLE: ScoreImportStatus[] = ['create', 'update'];

// ----------------------------------------------------------------------
// Xuất

export function scoreSheetItems(rows: IStudyBulkRow[]): ScoreSheetItem[] {
  return rows.map((row) => ({
    internId: row._id,
    base: row.report?.updatedAt || '',
    name: row.name,
    namejp: row.namejp,
    studyClass: row.studyClass,
    state: row.report ? 'draft' : 'missing',
    // Báo cáo tháng này nếu có; chưa có thì trình độ / tiến độ / tính cách / giáo viên gợi ý
    // từ tháng trước và lớp — cùng cách điền sẵn với trang Nhập hàng loạt.
    values: baselineEntry(row).values,
  }));
}

// ----------------------------------------------------------------------
// Nhập

const NUMBER_KEYS = [...SCORE_KEYS, ...JLPT_KEYS];

const TEXT_KEYS = ['level', 'learningProcess', 'characteristic', 'teacher'] as const;

// Ô số: nhận số hoặc chữ số (kể cả số toàn độ rộng "８５"); trống = chưa nhập.
const parseNumber = (raw: ScoreSheetCell): { value: number | null; bad: boolean } => {
  if (raw === null) return { value: null, bad: false };
  const text = (typeof raw === 'number' ? String(raw) : raw.normalize('NFKC')).trim();
  if (!text) return { value: null, bad: false };
  const value = Number(text);
  if (!Number.isFinite(value) || !Number.isInteger(value)) return { value: null, bad: true };
  return { value, bad: false };
};

const parseText = (raw: ScoreSheetCell) => (raw === null ? '' : String(raw).trim());

// So nhận xét theo phần chữ: bỏ khoảng trắng cuối dòng và dòng trống thừa.
const normalizeComment = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Chữ trong ô Excel → HTML của trình soạn thảo (ReactQuill): mỗi dòng một đoạn <p>.
export const textToCommentHtml = (text: string) =>
  text
    ? text
        .split('\n')
        .map((line) => `<p>${line ? escapeHtml(line) : '<br>'}</p>`)
        .join('')
    : '';

// updatedAt lúc xuất phiếu và hiện tại: so theo thời điểm (Excel có thể đổi cách ghi chữ).
const sameBase = (a: string, b: string) => {
  if (!a || !b) return !a && !b;
  return Date.parse(a) === Date.parse(b);
};

export function planScoreImport(
  records: ScoreSheetRecord[],
  rows: IStudyBulkRow[],
  htmlToText: (html: string) => string
): ScoreImportRow[] {
  const byId = new Map(rows.map((row) => [row._id, row]));
  const seen = new Set<string>();

  return records.map((record) => {
    const row = byId.get(record.internId);
    const current = row?.report || null;

    const result: ScoreImportRow = {
      rowNumber: record.rowNumber,
      internId: record.internId,
      name: row?.name || record.name,
      namejp: row?.namejp || '',
      studyClass: row?.studyClass || '',
      status: 'unknown',
      problems: [],
      changes: [],
      total: null,
      currentTotal: current?.total ?? null,
      payload: null,
    };

    if (!row) return result;

    if (seen.has(record.internId)) {
      return {
        ...result,
        status: 'invalid',
        problems: [{ key: 'score_sheet_problem_duplicate' }],
      };
    }
    seen.add(record.internId);

    // ---- Đọc giá trị trong file
    const badFields: BulkFieldKey[] = [];
    const numbers = Object.fromEntries(
      NUMBER_KEYS.map((key) => {
        const parsed = parseNumber(record.cells[key]);
        if (parsed.bad) badFields.push(key);
        return [key, parsed.value];
      })
    ) as Record<(typeof NUMBER_KEYS)[number], number | null>;

    const commentInFile = normalizeComment(parseText(record.cells.comment));
    // Chữ không đổi so với báo cáo hiện có thì giữ nguyên HTML cũ (định dạng, xuống dòng).
    const commentHtml =
      current && commentInFile === normalizeComment(htmlToText(current.comment || ''))
        ? current.comment
        : textToCommentHtml(commentInFile);

    const values: BulkValues = {
      ...numbers,
      level: parseText(record.cells.level).normalize('NFKC').toUpperCase(),
      learningProcess: parseText(record.cells.learningProcess),
      characteristic: parseText(record.cells.characteristic),
      // Bỏ trống giáo viên = giữ giáo viên cũ (BE cũng không xóa giáo viên).
      teacher: parseText(record.cells.teacher) || current?.teacher || '',
      comment: commentHtml,
    };

    // ---- So với báo cáo hiện có
    const changes: BulkFieldKey[] = [];
    if (current) {
      NUMBER_KEYS.forEach((key) => {
        if (values[key] !== (current[key] ?? null)) changes.push(key);
      });
      TEXT_KEYS.forEach((key) => {
        if (values[key] !== (current[key] || '').trim()) changes.push(key);
      });
      if (values.comment !== current.comment) changes.push('comment');
    }

    const hasInput =
      badFields.length > 0 ||
      NUMBER_KEYS.some((key) => values[key] !== null) ||
      !!commentText(values.comment);

    if (!current && !hasInput) return { ...result, status: 'empty' };

    if (current && !changes.length && !badFields.length) {
      return { ...result, status: 'unchanged', total: current.total };
    }

    if (current?.isPublic) return { ...result, status: 'locked', changes };

    if (!sameBase(record.base, current?.updatedAt || '')) {
      return { ...result, status: 'conflict', changes };
    }

    // ---- Kiểm tra "đủ mới lưu" (cùng quy tắc với trang Nhập hàng loạt và BE)
    const check = checkValues(values);
    const problems: ScoreImportProblem[] = [];

    if (badFields.length)
      problems.push({ key: 'score_sheet_problem_not_number', fields: badFields });

    const errorGroups = new Map<string, BulkFieldKey[]>();
    (Object.entries(check.errors) as Array<[BulkFieldKey, string]>).forEach(([field, key]) => {
      errorGroups.set(key, [...(errorGroups.get(key) || []), field]);
    });
    errorGroups.forEach((fields, key) => problems.push({ key, fields }));

    const missingScores = SCORE_KEYS.filter(
      (key) => values[key] === null && !badFields.includes(key)
    );
    if (missingScores.length) {
      problems.push({ key: 'score_sheet_problem_missing', fields: missingScores });
    }
    if (check.missingText.length) {
      problems.push({ key: 'score_sheet_problem_missing', fields: check.missingText });
    }

    if (problems.length) return { ...result, status: 'invalid', problems, changes };

    return {
      ...result,
      status: current ? 'update' : 'create',
      changes,
      total: check.total,
      payload: toPayload(record.internId, values),
    };
  });
}
