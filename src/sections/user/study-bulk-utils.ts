import { IStudyBulkRow, IStudyJlptKey, IStudyScoreKey } from 'src/types/user';

// ----------------------------------------------------------------------
// Logic của trang "Nhập điểm hàng loạt" — tách khỏi component để bảng (máy tính), dạng thẻ
// (điện thoại) và khung nhận xét dùng chung một cách kiểm tra.
//
// Quy tắc (chủ dự án chọn "đủ mới lưu"): một dòng chỉ lưu được khi đủ như form nhập điểm —
// 10 điểm, trình độ, tiến độ, tính cách, nhận xét. BE (study/updateBulk) kiểm tra lại y hệt.
// ----------------------------------------------------------------------

// Đúng thứ tự cột trên bản in: (B) đánh giá chung 6 mục, (C) kỹ năng tiếng Nhật 4 mục.
export const SCORE_KEYS: IStudyScoreKey[] = [
  'health',
  'cooperation',
  'attend',
  'discipline',
  'attitude',
  'acquiringKnowledge',
  'write',
  'read',
  'listen',
  'speak',
];

export const JLPT_KEYS: IStudyJlptKey[] = ['kanji', 'grammarAndReading', 'listeningComprehension'];

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const COMMENT_MAX = 300;

export type BulkTextKey = 'level' | 'learningProcess' | 'characteristic' | 'teacher' | 'comment';

export type BulkFieldKey = IStudyScoreKey | IStudyJlptKey | BulkTextKey;

export type BulkValues = Record<IStudyScoreKey | IStudyJlptKey, number | null> &
  Record<BulkTextKey, string>;

// suggested = điền sẵn từ tháng trước; edited = người nhập đã sửa trên trang này.
export type BulkOrigin = 'suggested' | 'edited';

export type BulkEntry = {
  values: BulkValues;
  origin: Partial<Record<BulkFieldKey, BulkOrigin>>;
};

export type BulkTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export type BulkCheck = {
  // Khóa i18n của lỗi từng ô
  errors: Partial<Record<BulkFieldKey, string>>;
  errorCount: number;
  missingScores: number;
  missingText: BulkTextKey[];
  complete: boolean;
  total: number | null;
};

export type BulkRowState = {
  check: BulkCheck;
  dirty: boolean;
  savable: boolean;
  // Báo cáo đã công khai chưa "Mở khóa để sửa": không sửa, không lưu được
  locked: boolean;
  status: { key: string; tone: BulkTone; params?: Record<string, number> };
};

// Nhận xét là HTML của trình soạn thảo; giới hạn tính trên phần chữ (BE đếm y hệt).
export const commentText = (html: string) =>
  (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&(amp|lt|gt|quot|#39);/g, '_')
    .trim();

const NUMBER_KEYS = [...SCORE_KEYS, ...JLPT_KEYS];

// Giá trị ban đầu của một dòng: báo cáo tháng này nếu đã có; chưa có thì để trống điểm và điền
// sẵn trình độ / tiến độ / tính cách từ tháng trước, giáo viên gần nhất (đánh dấu "gợi ý").
export function baselineEntry(row: IStudyBulkRow): BulkEntry {
  const { report, prev } = row;
  const origin: BulkEntry['origin'] = {};
  const numbers = Object.fromEntries(
    NUMBER_KEYS.map((key) => [key, report ? report[key] ?? null : null])
  ) as Record<IStudyScoreKey | IStudyJlptKey, number | null>;

  const suggest = (key: BulkTextKey, own: string, fallback: string) => {
    if (own) return own;
    if (fallback) origin[key] = 'suggested';
    return fallback;
  };

  const values: BulkValues = {
    ...numbers,
    level: suggest('level', report?.level || '', prev?.level || ''),
    learningProcess: suggest(
      'learningProcess',
      report?.learningProcess || '',
      prev?.learningProcess || ''
    ),
    characteristic: suggest(
      'characteristic',
      report?.characteristic || '',
      prev?.characteristic || ''
    ),
    teacher: suggest('teacher', report?.teacher || '', row.lastTeacher || ''),
    comment: report?.comment || '',
  };

  return { values, origin };
}

export function checkValues(values: BulkValues): BulkCheck {
  const errors: BulkCheck['errors'] = {};

  SCORE_KEYS.forEach((key) => {
    const value = values[key];
    if (value === null) return;
    if (value < 0 || value > 100) errors[key] = 'study_bulk_err_range';
    else if (key === 'read' && value % 10 !== 0) errors[key] = 'study_bulk_err_read';
  });

  JLPT_KEYS.forEach((key) => {
    const value = values[key];
    if (value !== null && (value < 0 || value > 60)) errors[key] = 'study_bulk_err_jlpt';
  });

  if (commentText(values.comment).length > COMMENT_MAX) errors.comment = 'study_bulk_err_comment';

  const missingScores = SCORE_KEYS.filter((key) => values[key] === null).length;

  const missingText: BulkTextKey[] = [];
  if (!LEVELS.includes(values.level)) missingText.push('level');
  if (!values.learningProcess.trim()) missingText.push('learningProcess');
  if (!values.characteristic.trim()) missingText.push('characteristic');
  if (!commentText(values.comment)) missingText.push('comment');

  const errorCount = Object.keys(errors).length;

  return {
    errors,
    errorCount,
    missingScores,
    missingText,
    complete: missingScores === 0 && missingText.length === 0 && errorCount === 0,
    total:
      missingScores === 0 ? SCORE_KEYS.reduce((sum, key) => sum + (values[key] || 0), 0) : null,
  };
}

// Dòng có báo cáo: chỉ "thay đổi" khi người nhập sửa một ô. Dòng chưa có báo cáo: có điểm là
// đã có việc cần lưu (kể cả điểm lấy từ tháng trước) — phần chữ điền sẵn thì không tính.
export function isDirty(row: IStudyBulkRow, entry: BulkEntry) {
  if (Object.values(entry.origin).includes('edited')) return true;
  if (row.report) return false;
  return SCORE_KEYS.some((key) => entry.values[key] !== null);
}

// Báo cáo đã công khai bị khóa cho tới khi người nhập bấm "Mở khóa để sửa" (xem studyLock bên BE).
export const isLocked = (row: IStudyBulkRow, unlocked: Record<string, boolean>) =>
  !!row.report?.isPublic && !unlocked[row._id];

export function rowState(
  row: IStudyBulkRow,
  entry: BulkEntry,
  saveError?: string,
  locked = false
): BulkRowState {
  const check = checkValues(entry.values);
  const dirty = isDirty(row, entry);
  const savable = dirty && check.complete && !locked;

  let status: BulkRowState['status'];
  if (saveError) status = { key: 'study_bulk_status_save_failed', tone: 'error' };
  else if (locked) {
    // Bản nháp cũ của một dòng nay đã bị khóa (ví dụ đã mở khóa, tải lại trang) thì vẫn báo có
    // thay đổi, nhưng phải mở khóa lại mới lưu được.
    status = dirty
      ? { key: 'study_bulk_status_locked_dirty', tone: 'warning' }
      : { key: 'study_bulk_status_published', tone: 'success' };
  } else if (check.errorCount) {
    status = {
      key: 'study_bulk_status_errors',
      tone: 'error',
      params: { count: check.errorCount },
    };
  } else if (!dirty && row.report) {
    status = row.report.isPublic
      ? { key: 'study_bulk_status_published', tone: 'success' }
      : { key: 'study_bulk_status_saved', tone: 'info' };
  } else if (!dirty) status = { key: 'study_bulk_status_empty', tone: 'default' };
  else if (check.missingScores) {
    status = {
      key: 'study_bulk_status_missing_scores',
      tone: 'warning',
      params: { count: check.missingScores },
    };
  } else if (check.missingText.includes('comment')) {
    status = { key: 'study_bulk_status_missing_comment', tone: 'warning' };
  } else if (check.missingText.length) {
    status = { key: 'study_bulk_status_missing_info', tone: 'warning' };
  } else status = { key: 'study_bulk_status_unsaved', tone: 'warning' };

  return { check, dirty, savable, locked, status };
}

// unlockPublished: dòng sửa một báo cáo đã công khai (người nhập đã mở khóa) — BE đòi cờ này.
export const toPayload = (internId: string, values: BulkValues, unlockPublished = false) => ({
  internId,
  unlockPublished,
  ...Object.fromEntries(NUMBER_KEYS.map((key) => [key, values[key]])),
  level: values.level,
  learningProcess: values.learningProcess.trim(),
  characteristic: values.characteristic.trim(),
  teacher: values.teacher.trim(),
  comment: values.comment,
});

// Ô điểm chỉ nhận chữ số (gõ nhầm chữ hay dấu thì bỏ đi); trống = chưa nhập.
export const parseScore = (raw: string) => {
  const digits = String(raw).replace(/[^\d]/g, '').slice(0, 3);
  return digits === '' ? null : Number(digits);
};

// Khối ô copy từ Excel: dòng cách bằng xuống dòng, cột cách bằng Tab.
export const parsePastedTable = (text: string) => {
  const lines = text.replace(/\r/g, '').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines.map((line) => line.split('\t'));
};

// ----------------------------------------------------------------------
// Bản nháp trên máy: phần đang nhập dở được giữ trong localStorage theo tháng, mở lại trang
// (hoặc tắt trình duyệt) vẫn còn. `base` = updatedAt của báo cáo lúc bắt đầu sửa — báo cáo
// đã được ai đó lưu lại sau đó thì bỏ bản nháp của dòng đó, không ghi đè.

export type BulkDraft = Record<string, { entry: BulkEntry; base: string | null }>;

const draftKey = (month: string) => `qltts.studyBulk.draft.v1.${month}`;

export function loadDraft(month: string): BulkDraft {
  try {
    const raw = window.localStorage.getItem(draftKey(month));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

export function saveDraft(month: string, draft: BulkDraft) {
  try {
    if (Object.keys(draft).length) {
      window.localStorage.setItem(draftKey(month), JSON.stringify(draft));
    } else {
      window.localStorage.removeItem(draftKey(month));
    }
  } catch (error) {
    // Trình duyệt chặn localStorage (chế độ riêng tư…): vẫn nhập được, chỉ không giữ bản nháp.
  }
}
