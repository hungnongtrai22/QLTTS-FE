// src/invoice/all-interns-pdf.tsx
import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import InternPDFAll from '../invoice/intern-pdf-all';

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Noto Sans JP',
    backgroundColor: '#FFFFFF',
    textTransform: 'capitalize',
    // padding: '40px 24px 120px 24px',
    padding: '10px 24px 10px 24px',
  },
});

export default function AllInternsPDF({ interns }: { interns: any[] }) {
  return (
    <Document>
      {interns.map((intern, index) => (
        <Page key={index} size="A4" style={styles.page}>
          {/* Render lại InternPDF cho mỗi trang */}
          <InternPDFAll invoice={intern} />
        </Page>
      ))}
    </Document>
  );
}
