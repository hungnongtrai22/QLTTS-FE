import { saveAs } from 'file-saver';
// utils
import {
  CONTRACT_FEES,
  CONTRACT_FEES_IN_WORDS,
  CONTRACT_SENDER,
  CONTRACT_TERM,
  ContractData,
  PASSPORT_ISSUER,
  SUPPLY_CONTRACT_DATE,
  buildContractData,
  contractFileName,
  formatContractDateWords,
  formatMoney,
  toExcelDate,
} from './contract';

// ----------------------------------------------------------------------
// Xuất hợp đồng ra Excel, đúng cấu trúc file mẫu "MẪU HĐLĐ.xlsx":
//  - Sheet DANH SÁCH: mỗi TTS một dòng, từ dòng 10.
//  - Sheet HĐLĐ: hợp đồng lấy dữ liệu qua VLOOKUP theo STT ở ô L2. Đổi L2 để xem người khác.
//
// Khuôn là public/assets/templates/hop-dong-lao-dong.xlsx — tạo bằng
// scripts/build-contract-template.js (đã gỡ dữ liệu cá nhân của file mẫu gốc).
//
// Công thức của HĐLĐ được ghi lại toàn bộ ở đây, kèm kết quả tính sẵn cho người thứ nhất:
// ứng dụng xem trước (điện thoại, Zalo, Drive) không tự tính công thức mà hiện kết quả lưu
// sẵn — thiếu nó thì bản xem trước trống trơn.
// ExcelJS (~1MB) nạp động lúc bấm xuất, không nằm trong bundle khởi động.
// ----------------------------------------------------------------------

type Worksheet = import('exceljs').Worksheet;
type CellValue = import('exceljs').CellValue;

const TEMPLATE_URL = `${process.env.PUBLIC_URL || ''}/assets/templates/hop-dong-lao-dong.xlsx`;

const FIRST_ROW = 10;
const BLANK_DATE = 'ngày …… tháng …… năm ……';

// Cột của sheet DANH SÁCH. `n` = số thứ tự cột tính từ B, dùng trong VLOOKUP($B:$AH).
const COLUMNS: Record<keyof ContractData, { col: string; n: number }> = {
  contractId: { col: 'C', n: 2 },
  contractDate: { col: 'D', n: 3 },
  honorific: { col: 'E', n: 4 },
  name: { col: 'F', n: 5 },
  gender: { col: 'G', n: 6 },
  birthday: { col: 'H', n: 7 },
  citizenId: { col: 'I', n: 8 },
  citizenDate: { col: 'J', n: 9 },
  citizenPlace: { col: 'K', n: 10 },
  passportId: { col: 'L', n: 11 },
  passportDate: { col: 'M', n: 12 },
  phone: { col: 'N', n: 13 },
  emergencyName: { col: 'O', n: 14 },
  emergencyRelationship: { col: 'P', n: 15 },
  emergencyPhone: { col: 'Q', n: 16 },
  interviewDate: { col: 'R', n: 17 },
  departureDate: { col: 'S', n: 18 },
  address: { col: 'T', n: 19 },
  tradeUnion: { col: 'U', n: 20 },
  company: { col: 'V', n: 21 },
  job: { col: 'W', n: 22 },
  companyAddress: { col: 'X', n: 23 },
  companyDirector: { col: 'Y', n: 24 },
  companyPhone: { col: 'Z', n: 25 },
  trainingAllowance: { col: 'AA', n: 26 },
  salary: { col: 'AB', n: 27 },
  tax: { col: 'AC', n: 28 },
  socialInsurance: { col: 'AD', n: 29 },
  housingFee: { col: 'AE', n: 30 },
};

type Key = keyof typeof COLUMNS;

const DATE_KEYS: Key[] = [
  'contractDate',
  'birthday',
  'citizenDate',
  'passportDate',
  'interviewDate',
  'departureDate',
];

function listValue(data: ContractData, key: Key): CellValue {
  const value = data[key];
  if (DATE_KEYS.includes(key)) return toExcelDate(value);
  if (value === '' || value === undefined) return null;
  return value as CellValue;
}

// ----------------------------------------------------------------------
// Sheet HĐLĐ: ô -> công thức + cách tính kết quả cho người đang hiện ở L2.
// Danh sách ô phải khớp EXPECTED_FORMULA_CELLS trong scripts/build-contract-template.js.

type Formula = { formula: string; result: (d: ContractData) => CellValue };

function buildFormulas(lastRow: number): Record<string, Formula> {
  const V = (key: Key) => `VLOOKUP($L$2,'DANH SÁCH'!$B$8:$AH$${lastRow},${COLUMNS[key].n},0)`;
  // Ô nguồn trống thì VLOOKUP trả 0 — hiện "" thay vì 0 hay 00/01/1900.
  const ORBLANK = (key: Key) => `IF(${V(key)}="","",${V(key)})`;
  const DATE_WORDS = (key: Key) =>
    `IF(${V(key)}="","${BLANK_DATE}","ngày "&DAY(${V(key)})&" tháng "&MONTH(${V(
      key
    )})&" năm "&YEAR(${V(key)}))`;

  const same = (key: Key): Formula => ({
    formula: ORBLANK(key),
    result: (d) => listValue(d, key) ?? '',
  });

  return {
    A5: { formula: `"Số: "&${ORBLANK('contractId')}`, result: (d) => `Số: ${d.contractId}` },
    A8: {
      formula: `"Hôm nay, "&${DATE_WORDS('contractDate')}&", tại ${
        CONTRACT_SENDER.nameTitleCase
      }, chúng tôi gồm:"`,
      result: (d) =>
        `Hôm nay, ${formatContractDateWords(d.contractDate) || BLANK_DATE}, tại ${
          CONTRACT_SENDER.nameTitleCase
        }, chúng tôi gồm:`,
    },
    A19: {
      formula: `"- "&${ORBLANK('honorific')}&" "&${ORBLANK(
        'name'
      )}&" (sau đây gọi là Người lao động)"`,
      result: (d) => `- ${d.honorific} ${d.name} (sau đây gọi là Người lao động)`,
    },
    D20: same('birthday'),
    H20: same('gender'),
    C21: same('address'),
    C22: same('citizenId'),
    H22: same('citizenDate'),
    A23: {
      formula: `"Nơi cấp: "&${ORBLANK('citizenPlace')}`,
      result: (d) => `Nơi cấp: ${d.citizenPlace}`,
    },
    B24: same('passportId'),
    F24: same('passportDate'),
    D25: same('emergencyName'),
    H25: same('emergencyPhone'),
    E26: same('emergencyRelationship'),
    E27: same('address'),
    A28: {
      formula: `" Căn cứ vào Hợp đồng cung ứng lao động ngày ${SUPPLY_CONTRACT_DATE} ký giữa ${
        CONTRACT_SENDER.nameTitleCase
      } với "&${ORBLANK(
        'tradeUnion'
      )}&" và thông báo việc người lao động đã trúng tuyển đi làm việc ở nước ngoài "&${DATE_WORDS(
        'interviewDate'
      )}&"."`,
      result: (d) =>
        ` Căn cứ vào Hợp đồng cung ứng lao động ngày ${SUPPLY_CONTRACT_DATE} ký giữa ${
          CONTRACT_SENDER.nameTitleCase
        } với ${
          d.tradeUnion
        } và thông báo việc người lao động đã trúng tuyển đi làm việc ở nước ngoài ${
          formatContractDateWords(d.interviewDate) || BLANK_DATE
        }.`,
    },
    D32: same('job'),
    C33: same('companyAddress'),
    D34: same('company'),
    E35: same('companyDirector'),
    B36: same('companyPhone'),
    D61: same('trainingAllowance'),
    B69: same('salary'),
    B75: same('tax'),
    E76: same('socialInsurance'),
    B77: same('housingFee'),
  };
}

// ----------------------------------------------------------------------
// Phần cố định lấy từ contract.ts để bản Excel và bản PDF không bao giờ lệch nhau.

// Chỉ thay chữ của từng đoạn, giữ nguyên font (đậm/gạch chân) của file mẫu.
function setRichText(ws: Worksheet, address: string, texts: string[]) {
  const cell = ws.getCell(address);
  const value = cell.value as any;
  if (value?.richText?.length === texts.length) {
    cell.value = {
      richText: value.richText.map((run: any, i: number) => ({ ...run, text: texts[i] })),
    };
  } else {
    cell.value = texts.join('');
  }
}

function writeStaticParts(ws: Worksheet) {
  const s = CONTRACT_SENDER;
  ws.getCell('A10').value = `Bên đưa đi: ${s.name} \n(${s.shortName}) `;
  ws.getCell('A11').value = `- Địa chỉ: ${s.address}`;
  ws.getCell('A12').value = `- Điện thoại: ${s.phone} `;
  ws.getCell('A13').value = `- E-mail: ${s.email}`;
  ws.getCell('A14').value = `- Địa chỉ trang thông tin điện tử: ${s.website}`;
  setRichText(ws, 'A15', ['- Người đại diện theo pháp luật của doanh nghiệp: ', s.representative]);
  ws.getCell('A16').value = `- Chức vụ: ${s.position}`;
  ws.getCell('H24').value = `Nơi cấp: ${PASSPORT_ISSUER}`;
  ws.getCell(
    'A31'
  ).value = `- Thời hạn của hợp đồng lao động: ${CONTRACT_TERM} ( tính từ ngày người lao động nhập cảnh vào Nhật Bản.)`;

  CONTRACT_FEES.forEach((fee) => {
    ws.getCell(`H${fee.row}`).value = `: ${formatMoney(fee.amount)} VNĐ`;
  });
  setRichText(ws, 'A56', ['(', 'Bằng chữ:', ` ${CONTRACT_FEES_IN_WORDS})`]);
  ws.getCell('A159').value = s.representative;
}

// ----------------------------------------------------------------------

function copyRowStyle(ws: Worksheet, from: number, to: number) {
  const source = ws.getRow(from);
  const target = ws.getRow(to);
  target.height = source.height;
  source.eachCell({ includeEmpty: true }, (cell, col) => {
    target.getCell(col).style = { ...cell.style };
  });
}

// `interns`: hồ sơ đầy đủ, đã populate tradeUnion + companySelect (GET /api/user/:id).
export async function exportContractsExcel(interns: any[]) {
  if (!interns.length) return;

  const [{ default: ExcelJS }, response] = await Promise.all([
    import('exceljs'),
    fetch(TEMPLATE_URL),
  ]);
  if (!response.ok) throw new Error(`Không tải được khuôn hợp đồng (HTTP ${response.status})`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await response.arrayBuffer());

  const list = workbook.getWorksheet('DANH SÁCH');
  const contract = workbook.getWorksheet('HĐLĐ');
  if (!list || !contract) throw new Error('Khuôn hợp đồng thiếu sheet DANH SÁCH hoặc HĐLĐ');

  const datas = interns.map(buildContractData);

  // --- DANH SÁCH ---
  datas.forEach((data, index) => {
    const rowNumber = FIRST_ROW + index;
    if (rowNumber > FIRST_ROW) copyRowStyle(list, FIRST_ROW, rowNumber);
    const row = list.getRow(rowNumber);
    row.getCell('B').value = { formula: 'ROW()-9', result: index + 1 };
    (Object.keys(COLUMNS) as Key[]).forEach((key) => {
      row.getCell(COLUMNS[key].col).value = listValue(data, key);
    });
  });

  // Vùng tra cứu tối thiểu tới dòng 70 như file mẫu; nhiều người hơn thì nới ra.
  const lastRow = Math.max(70, FIRST_ROW + datas.length - 1);
  list.autoFilter = `B8:AH${lastRow}`;

  // --- HĐLĐ: hiện người thứ nhất ---
  contract.getCell('L1').value = 'STT cần xem:';
  contract.getCell('L2').value = 1;
  const formulas = buildFormulas(lastRow);
  Object.entries(formulas).forEach(([address, { formula, result }]) => {
    contract.getCell(address).value = { formula, result: result(datas[0]) } as CellValue;
  });
  writeStaticParts(contract);

  workbook.calcProperties.fullCalcOnLoad = true;

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    contractFileName(interns, 'xlsx')
  );
}
