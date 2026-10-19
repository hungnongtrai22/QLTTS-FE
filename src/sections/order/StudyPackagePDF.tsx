import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
// types
import { IStudyPackageItem, IStudyPackageMeta } from 'src/types/user';
// utils
import { evaluateStudent, normalizeName } from 'src/utils/studyGrade';
//
import InternPDFStudy from '../invoice/intern-pdf-study';

// ----------------------------------------------------------------------
// Gói báo cáo học tập gửi đối tác (trang "Báo cáo học tập" → "Xuất báo cáo").
//   Trang 1: bảng tổng hợp cả gói.
//   Sau đó: mỗi TTS một trang, đúng mẫu báo cáo đang gửi lẻ từ hồ sơ TTS (InternPDFStudy).
// Font Noto Sans JP đã được đăng ký trong intern-pdf-study.
// ----------------------------------------------------------------------

const BORDER = '#000000';
const HEAD_BG = '#A6E3E9'; // cùng màu ô tiêu đề của mẫu báo cáo

const styles = StyleSheet.create({
  // Giống AllStudyPDF — trang báo cáo của từng TTS
  page: {
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Noto Sans JP',
    backgroundColor: '#FFFFFF',
    textTransform: 'capitalize',
    padding: '10px 24px 10px 24px',
  },
  pageBorder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderStyle: 'solid',
  },
  cover: {
    fontSize: 8.5,
    lineHeight: 1.5,
    fontFamily: 'Noto Sans JP',
    backgroundColor: '#FFFFFF',
    padding: '28px 28px 36px 28px',
  },
  title: { fontSize: 15, fontWeight: 700, textAlign: 'center' },
  subtitle: { fontSize: 11, textAlign: 'center', marginTop: 2, marginBottom: 14 },
  meta: { borderWidth: 0.75, borderColor: BORDER, marginBottom: 14 },
  metaRow: { flexDirection: 'row', borderTopWidth: 0.75, borderColor: BORDER },
  metaKey: {
    width: '24%',
    backgroundColor: HEAD_BG,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRightWidth: 0.75,
    borderColor: BORDER,
  },
  metaValue: { width: '76%', paddingVertical: 3, paddingHorizontal: 6 },
  // Viền đặt trên từng dòng (không đặt ở khung ngoài) để bảng sang trang không để lại viền thừa.
  tr: {
    flexDirection: 'row',
    borderLeftWidth: 0.75,
    borderRightWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: BORDER,
  },
  th: { backgroundColor: HEAD_BG, fontWeight: 700, borderTopWidth: 0.75 },
  td: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderRightWidth: 0.75,
    borderColor: BORDER,
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  small: { fontSize: 7 },
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 28,
    right: 28,
    fontSize: 7,
    color: '#637381',
    textAlign: 'right',
  },
});

// Cột bảng tổng hợp (tổng 100%)
const COLUMNS: Array<{ label: string; width: string; center?: boolean }> = [
  { label: 'No.', width: '5%', center: true },
  { label: '実習生の氏名', width: '25%' },
  { label: '受け入れ企業', width: '22%' },
  { label: '学習\n期間', width: '7%', center: true },
  { label: '合計点\n(1000)', width: '9%', center: true },
  { label: '前月比', width: '8%', center: true },
  { label: '総合\n評価', width: '7%', center: true },
  { label: 'JLPT\nレベル', width: '7%', center: true },
  { label: '学習進捗', width: '10%', center: true },
];

// "皆の日本語第45課" → "第45課" cho vừa cột
const shortLesson = (value: string) => {
  const index = (value || '').indexOf('第');
  return index >= 0 ? value.substring(index) : value || '';
};

const jpDate = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

const jpMonth = (month: string) => {
  const [year, monthNo] = month.split('-');
  return `${year}年${Number(monthNo)}月分`;
};

// Mẫu báo cáo đọc thẳng intern.tradeUnion.name / companySelect.name — TTS thiếu thì để trống
// thay vì làm hỏng cả file.
const safeIntern = (intern: Record<string, any>) => ({
  ...intern,
  tradeUnion: intern.tradeUnion || { name: '' },
  companySelect: intern.companySelect || { name: '' },
});

type Props = {
  items: IStudyPackageItem[];
  meta: IStudyPackageMeta;
};

export default function StudyPackagePDF({ items, meta }: Props) {
  const cell = (index: number, extra?: Style): Style[] => [
    styles.td,
    { width: COLUMNS[index].width },
    ...(COLUMNS[index].center ? [styles.center] : []),
    ...(index === COLUMNS.length - 1 ? [{ borderRightWidth: 0 }] : []),
    ...(extra ? [extra] : []),
  ];

  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <Text style={styles.title}>技能実習生事前教育評価表 一覧</Text>
        <Text style={styles.subtitle}>{jpMonth(meta.month)}</Text>

        <View style={styles.meta}>
          {[
            meta.tradeUnion ? ['組合・管理団体の名称', `${meta.tradeUnion}様`] : null,
            meta.company ? ['受け入れ企業の名称', `${meta.company}様`] : null,
            ['報告機関', 'NHAT TAN 人材育成・提供有限会社　教育部'],
            ['作成日', jpDate(new Date())],
            ['人数', `${items.length}名`],
          ]
            .filter((row): row is string[] => !!row)
            .map(([key, value], index) => (
              <View key={key} style={[styles.metaRow, index === 0 ? { borderTopWidth: 0 } : {}]}>
                <Text style={styles.metaKey}>{key}</Text>
                <Text style={styles.metaValue}>{value}</Text>
              </View>
            ))}
        </View>

        <View>
          <View style={[styles.tr, styles.th]}>
            {COLUMNS.map((column, index) => (
              <Text key={column.label} style={cell(index)}>
                {column.label}
              </Text>
            ))}
          </View>

          {items.map(({ report, intern, prevTotal }, row) => {
            const total = Number(report.total) || 0;
            const delta = prevTotal === null ? null : total - prevTotal;
            return (
              <View key={report._id} style={styles.tr} wrap={false}>
                <Text style={cell(0)}>{row + 1}</Text>
                <View style={cell(1)}>
                  <Text>{normalizeName(intern.name || '')}</Text>
                  <Text style={styles.small}>{intern.namejp}</Text>
                </View>
                <View style={cell(2)}>
                  <Text>{intern.companySelect?.name || ''}</Text>
                  <Text style={styles.small}>{intern.tradeUnion?.name || ''}</Text>
                </View>
                <Text style={cell(3)}>{report.time ? `${report.time}ヶ月` : ''}</Text>
                <Text style={cell(4, { fontWeight: 700 })}>{total}</Text>
                <Text style={cell(5)}>
                  {delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
                </Text>
                <Text style={cell(6)}>
                  {evaluateStudent(
                    report.discipline,
                    report.attitude,
                    report.health,
                    report.cooperation,
                    report.attend,
                    total
                  )}
                </Text>
                <Text style={cell(7)}>{report.level}</Text>
                <Text style={cell(8)}>{shortLesson(report.learningProcess)}</Text>
              </View>
            );
          })}
        </View>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {items.map(({ report, intern }) => (
        <Page key={report._id} size="A4" style={styles.page}>
          <View style={styles.pageBorder}>
            <InternPDFStudy item={report} intern={safeIntern(intern)} />
          </View>
        </Page>
      ))}
    </Document>
  );
}
