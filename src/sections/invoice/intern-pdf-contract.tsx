import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
// utils
import {
  CONTRACT_CLAUSES,
  CONTRACT_FEES_IN_WORDS,
  CONTRACT_FORM,
  CONTRACT_SENDER,
  CONTRACT_TERM,
  ContractBlock,
  ContractData,
  PASSPORT_ISSUER,
  SUPPLY_CONTRACT_DATE,
  buildContractData,
  formatContractDate,
  formatContractDateWords,
  formatMoney,
} from 'src/utils/contract';

// ----------------------------------------------------------------------
// Hợp đồng đưa người lao động đi làm việc ở nước ngoài — bản PDF.
// Bố cục bám sheet HĐLĐ của "MẪU HĐLĐ.xlsx". Hai chỗ cố ý khác file mẫu:
//  - "Nơi cấp" của hộ chiếu xuống dòng riêng: file mẫu in ra bị cắt chữ ở mép phải.
//  - Ngày in dạng dd/mm/yyyy thay vì kiểu Mỹ của ô Excel.
// Nhiều TTS thì mỗi người một hợp đồng, mỗi hợp đồng bắt đầu ở trang mới.
// ----------------------------------------------------------------------

// Tinos: cùng số đo chữ với Times New Roman (font của file mẫu), đủ dấu tiếng Việt,
// giấy phép OFL (public/fonts/Tinos-OFL.txt).
Font.register({
  family: 'Tinos',
  fonts: [
    { src: '/fonts/Tinos-Regular.ttf' },
    { src: '/fonts/Tinos-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/Tinos-Italic.ttf', fontStyle: 'italic' },
    { src: '/fonts/Tinos-BoldItalic.ttf', fontWeight: 700, fontStyle: 'italic' },
  ],
});

// Tên nghiệp đoàn/xí nghiệp trong CSDL thường là tiếng Nhật (協同組合…, 株式会社…) mà Tinos
// không có chữ Nhật -> in ra ô trống. Ký tự nào Tinos thiếu thì lấy từ Noto Sans JP (cùng
// file với hồ sơ tiếng Nhật). Chỉ bật khi hợp đồng thật sự có chữ Nhật: react-pdf tải MỌI
// font trong danh sách dự phòng, mà Noto Sans JP nặng ~5,7MB mỗi kiểu chữ.
Font.register({
  family: 'Contract JP',
  fonts: [
    { src: '/fonts/NotoSansJP-Regular.ttf' },
    { src: '/fonts/NotoSansJP-Bold.ttf', fontWeight: 700 },
    // Noto Sans JP không có bản nghiêng, mà react-pdf đòi khớp đúng fontStyle: thiếu là báo
    // "Could not resolve font" ở các dòng chữ nghiêng (ghi chú dưới chữ ký). Dùng bản đứng.
    { src: '/fonts/NotoSansJP-Regular.ttf', fontStyle: 'italic' },
    { src: '/fonts/NotoSansJP-Bold.ttf', fontWeight: 700, fontStyle: 'italic' },
  ],
});

const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;

const hasJapanese = (data: ContractData) =>
  Object.values(data).some((value) => typeof value === 'string' && JAPANESE.test(value));

// Không ngắt từ bằng dấu gạch nối: thuật toán mặc định dành cho tiếng Anh, áp vào tiếng
// Việt sẽ cắt ngang âm tiết ("NGU-YỄN").
Font.registerHyphenationCallback((word) => [word]);

const BLANK = '……………………';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 12,
    lineHeight: 1.35,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 64,
    paddingRight: 44,
  },
  formCode: { fontSize: 10, fontStyle: 'italic', textAlign: 'right' },
  center: { textAlign: 'center' },
  bold: { fontWeight: 700 },
  italic: { fontStyle: 'italic' },
  underline: { textDecoration: 'underline' },
  nation: { fontWeight: 700, textAlign: 'center', marginTop: 4 },
  title: { fontSize: 17, fontWeight: 700, textAlign: 'center', marginTop: 10, lineHeight: 1.25 },
  legalBasis: { fontSize: 9.5, fontStyle: 'italic', textAlign: 'center', marginTop: 2 },
  number: { fontSize: 13, fontWeight: 700, textAlign: 'center', marginTop: 4, marginBottom: 14 },
  line: { marginBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 3 },
  heading: { fontWeight: 700, textDecoration: 'underline', marginTop: 6, marginBottom: 3 },
  fee: { flexDirection: 'row', marginBottom: 3 },
  feeLabel: { width: '62%' },
  feeAmount: { width: '38%' },
  signature: { flexDirection: 'row', marginTop: 18 },
  signatureCol: { width: '50%', alignItems: 'center' },
  signatureName: { fontWeight: 700, marginTop: 70 },
});

const orBlank = (value?: string | null) => value || BLANK;

// ----------------------------------------------------------------------

function Field({ label, value, width }: { label: string; value?: string | null; width?: string }) {
  return (
    <Text style={width ? { width } : undefined}>
      {label} {orBlank(value)}
    </Text>
  );
}

function Clause({ block, data }: { block: ContractBlock; data: ContractData }) {
  switch (block.kind) {
    case 'heading':
      // minPresenceAhead: không để tiêu đề điều khoản nằm trơ trọi ở cuối trang.
      return (
        <Text style={styles.heading} minPresenceAhead={40}>
          {block.text}
        </Text>
      );
    case 'fee':
      return (
        <View style={styles.fee} wrap={false}>
          <Text style={[styles.feeLabel, block.bold ? styles.bold : {}]}>{block.label}</Text>
          <Text style={[styles.feeAmount, block.bold ? styles.bold : {}]}>
            : {formatMoney(block.amount)} VNĐ
          </Text>
        </View>
      );
    case 'feeWords':
      return (
        <Text style={[styles.line, styles.bold]}>
          (<Text style={styles.underline}>Bằng chữ:</Text> {CONTRACT_FEES_IN_WORDS})
        </Text>
      );
    case 'money':
      return (
        <Text style={styles.line}>
          {block.label} {formatMoney(data[block.field]) || BLANK} {block.suffix}
        </Text>
      );
    default:
      return <Text style={[styles.line, block.bold ? styles.bold : {}]}>{block.text}</Text>;
  }
}

function Contract({ data }: { data: ContractData }) {
  const contractDay = formatContractDateWords(data.contractDate) || 'ngày …… tháng …… năm ……';
  const interviewDay = formatContractDateWords(data.interviewDate) || 'ngày …… tháng …… năm ……';

  return (
    <Page
      size="A4"
      style={[
        styles.page,
        // react-pdf nhận mảng font dự phòng; kiểu Style khai báo chỉ là string.
        hasJapanese(data) ? { fontFamily: ['Tinos', 'Contract JP'] as unknown as string } : {},
      ]}
    >
      <Text style={styles.formCode}>{CONTRACT_FORM.code}</Text>

      <Text style={styles.nation}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
      <Text style={[styles.center, styles.bold]}>Độc Lập- Tự Do- Hạnh Phúc</Text>
      <Text style={styles.center}>…o0o…</Text>

      <Text style={styles.title}>{CONTRACT_FORM.title.join('\n')}</Text>
      <Text style={styles.legalBasis}>{CONTRACT_FORM.legalBasis}</Text>
      <Text style={styles.number}>Số: {orBlank(data.contractId)}</Text>

      <Text style={styles.line}>
        Hôm nay, {contractDay}, tại {CONTRACT_SENDER.nameTitleCase}, chúng tôi gồm:
      </Text>

      {/* Bên đưa đi */}
      <Text style={[styles.line, styles.bold, { marginTop: 4 }]}>
        Bên đưa đi: {CONTRACT_SENDER.name}
        {'\n'}({CONTRACT_SENDER.shortName})
      </Text>
      <Text style={styles.line}>- Địa chỉ: {CONTRACT_SENDER.address}</Text>
      <Text style={styles.line}>- Điện thoại: {CONTRACT_SENDER.phone}</Text>
      <Text style={styles.line}>- E-mail: {CONTRACT_SENDER.email}</Text>
      <Text style={styles.line}>- Địa chỉ trang thông tin điện tử: {CONTRACT_SENDER.website}</Text>
      <Text style={styles.line}>
        - Người đại diện theo pháp luật của doanh nghiệp:{' '}
        <Text style={styles.bold}>{CONTRACT_SENDER.representative}</Text>
      </Text>
      <Text style={styles.line}>- Chức vụ: {CONTRACT_SENDER.position}</Text>

      <Text style={[styles.line, { marginTop: 4 }]}>Và</Text>

      {/* Người lao động */}
      <Text style={[styles.line, styles.bold]}>
        - {data.honorific || 'Ông/Bà'} {orBlank(data.name)} (sau đây gọi là Người lao động)
      </Text>
      <View style={styles.row}>
        <Field
          width="62%"
          label="- Ngày tháng năm sinh:"
          value={formatContractDate(data.birthday)}
        />
        <Field width="38%" label="Giới tính:" value={data.gender} />
      </View>
      <Field label="- Địa chỉ thường trú:" value={data.address} />
      <View style={[styles.row, { marginTop: 3 }]}>
        <Field width="62%" label="- Số CCCD/ĐDCN:" value={data.citizenId} />
        <Field width="38%" label="Ngày cấp:" value={formatContractDate(data.citizenDate)} />
      </View>
      <Text style={styles.line}>Nơi cấp: {orBlank(data.citizenPlace)}</Text>
      <View style={styles.row}>
        <Field width="62%" label="- Số Hộ chiếu:" value={data.passportId} />
        <Field width="38%" label="Ngày cấp:" value={formatContractDate(data.passportDate)} />
      </View>
      <Text style={styles.line}>Nơi cấp: {PASSPORT_ISSUER}</Text>
      <View style={styles.row}>
        <Field width="62%" label="- Người được báo tin:" value={data.emergencyName} />
        <Field width="38%" label="Số điện thoại:" value={data.emergencyPhone} />
      </View>
      <Text style={[styles.line, { paddingLeft: 36 }]}>
        Mối quan hệ với người lao động: {orBlank(data.emergencyRelationship)}
      </Text>
      <Text style={styles.line}>- Địa chỉ báo tin tại Việt Nam: {orBlank(data.address)}</Text>

      <Text style={[styles.line, { marginTop: 4 }]}>
        Căn cứ vào Hợp đồng cung ứng lao động ngày {SUPPLY_CONTRACT_DATE} ký giữa{' '}
        {CONTRACT_SENDER.nameTitleCase} với {orBlank(data.tradeUnion)} và thông báo việc người lao
        động đã trúng tuyển đi làm việc ở nước ngoài {interviewDay}.
      </Text>
      <Text style={styles.line}>
        Hai Bên thoả thuận và ký kết thực hiện các điều khoản hợp đồng sau đây:
      </Text>

      {/* Điều 1 */}
      <Text style={styles.heading} minPresenceAhead={40}>
        Điều 1: Điều khoản chung
      </Text>
      <Text style={styles.line}>
        - Thời hạn của hợp đồng lao động: {CONTRACT_TERM} ( tính từ ngày người lao động nhập cảnh
        vào Nhật Bản.)
      </Text>
      <Field label="- Ngành, nghề, công việc :" value={data.job} />
      <Text style={styles.line}>- Địa điểm làm việc: {orBlank(data.companyAddress)}</Text>
      <Text style={styles.line}>- Người sử dụng lao động: {orBlank(data.company)}</Text>
      <View style={[styles.row, { marginTop: 0 }]}>
        <Field
          width="62%"
          label="- Đại diện người sử dụng lao động:"
          value={data.companyDirector}
        />
        <Text style={{ width: '38%' }}>Chức vụ: Giám đốc</Text>
      </View>
      <Field label="- Điện thoại:" value={data.companyPhone} />

      {/* Điều 2 -> Điều 10 */}
      {CONTRACT_CLAUSES.map((block, index) => (
        <Clause key={index} block={block} data={data} />
      ))}

      {/* Chữ ký: giữ nguyên khối trên cùng một trang */}
      <View style={styles.signature} wrap={false}>
        <View style={styles.signatureCol}>
          <Text style={[styles.bold, styles.center]}>
            Người đại diện theo pháp luật{'\n'}của Bên đưa đi
          </Text>
          <Text style={[styles.italic, { fontSize: 11 }]}>(Ký tên, đóng dấu và ghi rõ họ tên)</Text>
          <Text style={styles.signatureName}>{CONTRACT_SENDER.representative}</Text>
        </View>
        <View style={styles.signatureCol}>
          <Text style={[styles.bold, styles.center]}>Người lao động</Text>
          <Text style={[styles.italic, { fontSize: 11 }]}>( Ký tên và ghi rõ họ tên )</Text>
        </View>
      </View>
    </Page>
  );
}

// ----------------------------------------------------------------------

type Props = {
  // Hồ sơ TTS đầy đủ, đã populate tradeUnion + companySelect (GET /api/user/:id).
  interns: any[];
};

export default function InternContractPDF({ interns }: Props) {
  return (
    <Document title="Hợp đồng đưa người lao động đi làm việc ở nước ngoài">
      {interns.map((intern, index) => (
        <Contract key={intern?._id || index} data={buildContractData(intern)} />
      ))}
    </Document>
  );
}
