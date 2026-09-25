/* eslint-disable no-console */
// ----------------------------------------------------------------------
// Tạo khuôn Excel hợp đồng (public/assets/templates/hop-dong-lao-dong.xlsx) từ file mẫu
// gốc "MẪU HĐLĐ.xlsx". Chạy lại mỗi khi file mẫu gốc thay đổi:
//
//   node scripts/build-contract-template.js "MẪU HĐLĐ.xlsx"
//
// Mọi thứ trong public/ AI CŨNG TẢI ĐƯỢC, nên script phải gỡ sạch dữ liệu cá nhân:
//  - Xoá các dòng TTS trong sheet DANH SÁCH (chỉ giữ dòng 10 làm khuôn định dạng).
//  - Xoá kết quả công thức lưu sẵn trong sheet HĐLĐ (đang chứa tên, CCCD của dòng 10).
//  - Bỏ sheet "3" (mẫu cũ của công ty khác) và "Sheet13" (trống).
//  - Liên kết ngoài (externalLinks) và tác giả trong metadata không được ghi lại.
// Ngoài ra sửa cách in: đặt vùng in A:K, co vừa khổ ngang, gỡ ô gộp rác ngoài cột K
// (file gốc xuất PDF ra 9832 trang vì dòng 117 gộp ô tới tận cột XFD).
//
// Công thức của sheet HĐLĐ KHÔNG được sửa ở đây — ExportContract.tsx ghi đè toàn bộ lúc
// xuất file. Script chỉ kiểm tra danh sách ô công thức còn đúng như ExportContract chờ đợi.
// ----------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const SRC = process.argv[2];
const OUT = path.join(__dirname, '..', 'public', 'assets', 'templates', 'hop-dong-lao-dong.xlsx');

// Phải khớp HDLD_FORMULA_CELLS trong src/utils/ExportContract.tsx
const EXPECTED_FORMULA_CELLS = [
  'A5', 'A8', 'A19', 'D20', 'H20', 'C21', 'C22', 'H22', 'A23', 'B24', 'F24', 'D25', 'H25',
  'E26', 'E27', 'A28', 'D32', 'C33', 'D34', 'E35', 'B36', 'D61', 'B69', 'B75', 'E76', 'B77',
];

const LAST_COL = 11; // K
const SELECTOR_COL = 12; // L — ô L2 chọn STT cần hiện

const DATE_COLS = ['D', 'H', 'J', 'M', 'R', 'S'];
const MONEY_COLS = ['AA', 'AB', 'AC', 'AD', 'AE'];
const TEXT_COLS = ['C', 'I', 'L', 'N', 'Q', 'Z']; // số giấy tờ, số điện thoại: giữ số 0 đầu

// Giá trị hiển thị của một ô (kể cả kết quả công thức lưu sẵn) — dùng để dò dữ liệu cá nhân.
function cellText(cell) {
  const v = cell.value;
  if (v === null || v === undefined) return '';
  if (typeof v !== 'object') return String(v).trim();
  if (v.richText) return v.richText.map((t) => t.text).join('').trim();
  if (v.result !== undefined && v.result !== null && typeof v.result !== 'object') return String(v.result).trim();
  return '';
}

function collectText(wb) {
  const values = new Set();
  wb.eachSheet((ws) => ws.eachRow((row) => row.eachCell((cell) => {
    const t = cellText(cell);
    if (t) values.add(t);
  })));
  return values;
}

// ExcelJS dùng CHUNG một đối tượng style cho các ô có cùng định dạng trong file gốc: gán
// `cell.numFmt = ...` sẽ đổi luôn các ô khác. (Đã gặp: đặt H20 = General rồi đặt D20 =
// dd/mm/yyyy thì H20 bị đổi ngược theo.) Luôn tạo style riêng cho ô trước khi sửa.
function setNumFmt(cell, numFmt) {
  // eslint-disable-next-line no-param-reassign
  cell.style = { ...cell.style, numFmt };
}

async function main() {
  if (!SRC || !fs.existsSync(SRC)) {
    throw new Error('Thiếu đường dẫn file mẫu. Cách dùng: node scripts/build-contract-template.js "MẪU HĐLĐ.xlsx"');
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SRC);

  // Dữ liệu cá nhân phải biến mất: mọi ô từ dòng 10 của DANH SÁCH và kết quả công thức
  // lưu sẵn của HĐLĐ (tên, CCCD... của người ở dòng 10). Đối chiếu sau khi ghi file.
  const personal = new Set();
  const srcList = wb.getWorksheet('DANH SÁCH');
  for (let r = 10; r <= srcList.rowCount; r += 1) {
    srcList.getRow(r).eachCell((cell, col) => {
      const t = cellText(cell);
      if (col > 2 && t.length >= 5) personal.add(t);
    });
  }
  wb.getWorksheet('HĐLĐ').eachRow((row) => row.eachCell((cell) => {
    const v = cell.value;
    if (v && typeof v === 'object' && (v.formula || v.sharedFormula)) {
      const t = cellText(cell);
      if (t.length >= 5) personal.add(t);
    }
  }));

  ['3', 'Sheet13'].forEach((name) => {
    const ws = wb.getWorksheet(name);
    if (ws) wb.removeWorksheet(ws.id);
  });

  // ---------------- DANH SÁCH ----------------
  const list = wb.getWorksheet('DANH SÁCH');
  // Xoá trắng từng ô: spliceRows của ExcelJS không xoá được dòng trên sheet này
  // (đã thử — 34 dòng CCCD vẫn còn nguyên sau khi splice).
  for (let r = 11; r <= list.rowCount; r += 1) {
    list.getRow(r).eachCell({ includeEmpty: true }, (cell) => {
      cell.value = null;
    });
  }
  const styleRow = list.getRow(10);
  for (let c = 3; c <= 35; c += 1) styleRow.getCell(c).value = null;
  styleRow.getCell('B').value = { formula: 'ROW()-9' };
  DATE_COLS.forEach((col) => { setNumFmt(styleRow.getCell(col), 'dd/mm/yyyy'); });
  MONEY_COLS.forEach((col) => { setNumFmt(styleRow.getCell(col), '#,##0'); });
  TEXT_COLS.forEach((col) => { setNumFmt(styleRow.getCell(col), '@'); });
  // Cột chữ bị định dạng ngày nhầm trong file gốc (Danh xưng, Nơi cấp)
  ['E', 'K'].forEach((col) => { setNumFmt(styleRow.getCell(col), 'General'); });

  // ---------------- HĐLĐ ----------------
  const hd = wb.getWorksheet('HĐLĐ');

  (hd.model.merges || []).forEach((range) => {
    const start = hd.getCell(range.split(':')[0]);
    if (start.col > LAST_COL) hd.unMergeCells(range);
  });
  hd.eachRow({ includeEmpty: true }, (row) => {
    if (row.cellCount > SELECTOR_COL) row.splice(SELECTOR_COL + 1, row.cellCount - SELECTOR_COL);
  });

  const found = [];
  hd.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      // ô phụ trong vùng gộp trả về giá trị của ô chính — chỉ xét ô chính
      if (cell.isMerged && cell.master.address !== cell.address) return;
      const v = cell.value;
      if (v && typeof v === 'object' && (v.formula || v.sharedFormula)) {
        found.push(cell.address);
        cell.value = { formula: v.formula || v.sharedFormula }; // bỏ kết quả lưu sẵn
      }
    });
  });
  const missing = EXPECTED_FORMULA_CELLS.filter((a) => !found.includes(a));
  const extra = found.filter((a) => !EXPECTED_FORMULA_CELLS.includes(a));
  if (missing.length || extra.length) {
    throw new Error(`Ô công thức của HĐLĐ đã đổi. Thiếu: ${missing.join(',') || '-'} | Thừa: ${extra.join(',') || '-'}. Cập nhật HDLD_FORMULA_CELLS trong ExportContract.tsx trước.`);
  }

  hd.getCell('L2').value = 1;
  // Hai ô chữ (giới tính, SĐT người báo tin) mang nhầm định dạng ngày trong file gốc.
  ['H20', 'H25'].forEach((a) => { setNumFmt(hd.getCell(a), 'General'); });
  // Ngày cấp CCCD: ô H22 chỉ rộng ~10 ký tự nên ngày thật hiện "#########". File gốc né
  // được vì người soạn gõ ngày dạng chữ. Gộp sang các ô trống I:K cho đủ chỗ.
  if (!hd.getCell('H22').isMerged) hd.mergeCells('H22:K22');
  // Excel căn phải ngày theo mặc định -> sau khi gộp, ngày bị dồn ra mép phải trang.
  const h22 = hd.getCell('H22');
  h22.style = { ...h22.style, alignment: { ...h22.style.alignment, horizontal: 'left' } };
  ['D20', 'H22', 'F24'].forEach((a) => { setNumFmt(hd.getCell(a), 'dd/mm/yyyy'); });
  ['D61', 'B69', 'B75', 'E76', 'B77'].forEach((a) => { setNumFmt(hd.getCell(a), '#,##0'); });

  hd.pageSetup = {
    ...hd.pageSetup,
    paperSize: 9,
    orientation: 'portrait',
    printArea: `A1:K${hd.rowCount}`,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  // ---------------- Workbook ----------------
  wb.creator = 'QLTTS';
  wb.lastModifiedBy = 'QLTTS';
  wb.created = new Date(0);
  wb.modified = new Date(0);
  wb.calcProperties.fullCalcOnLoad = true;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await wb.xlsx.writeFile(OUT);
  const check = new ExcelJS.Workbook();
  await check.xlsx.readFile(OUT);
  const leaked = [...collectText(check)].filter((t) => personal.has(t));
  if (leaked.length) {
    fs.unlinkSync(OUT);
    throw new Error(`Khuôn còn sót ${leaked.length} giá trị cá nhân từ file gốc — đã xoá file đầu ra, không dùng được.`);
  }

  console.log(`Đã ghi ${OUT} (${fs.statSync(OUT).size} bytes) — ${found.length} ô công thức, sheet: ${wb.worksheets.map((w) => w.name).join(', ')}; đã dò ${personal.size} giá trị cá nhân: không còn sót`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
