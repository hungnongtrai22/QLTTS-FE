import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import InternPDFAll from '../invoice/intern-pdf-all';
import InternPDFHome from '../invoice/intern-pdf-home';

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Noto Sans JP',
    backgroundColor: '#FFFFFF',
    textTransform: 'capitalize',
    padding: '10px 24px 10px 24px',
  },
});

// Hàm chia mảng thành các nhóm 9 phần tử
const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export default function AllInternsPDF({ interns }: { interns: any[] }) {
  const internChunks = chunkArray(interns, 9); // chia interns ra từng nhóm 9 người

  return (
    <Document>
      {/* Mỗi nhóm interns (tối đa 9) được render bởi InternPDFHome trên một Page */}
      {internChunks.map((group, index) => (
        <Page key={`home-${index}`} size="A4" orientation="landscape" style={styles.page}>
          <InternPDFHome invoice={group} />
        </Page>
      ))}

      {/* Sau đó render từng intern bằng InternPDFAll như cũ */}
      {interns.map((intern, index) => (
        <Page key={`detail-${index}`} size="A4" style={styles.page}>
          <InternPDFAll invoice={intern} stt={index + 1} />
        </Page>
      ))}
    </Document>
  );
}
