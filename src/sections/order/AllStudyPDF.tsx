import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import InternPDFAll from '../invoice/intern-pdf-all';
import InternPDFHome from '../invoice/intern-pdf-home';
import InternPDFStudy from '../invoice/intern-pdf-study';

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Noto Sans JP',
    backgroundColor: '#FFFFFF',
    textTransform: 'capitalize',
    padding: '10px 24px 10px 24px',
  },
  pageBorder: {
    flex: 1, // 👈 QUAN TRỌNG
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'black',
    borderStyle: 'solid',
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

export default function AllStudyPDF() {

  return (
    <Document>


      {/* Sau đó render từng intern bằng InternPDFAll như cũ */}
      {/* {interns.map((intern, index) => (
        <Page key={`detail-${index}`} size="A4" style={styles.page}>
          <View style={styles.pageBorder}>
            <InternPDFAll invoice={intern} stt={index + 1} />
          </View>
        </Page>
      ))} */}

        <Page  size="A4" style={styles.page}>
          <View style={styles.pageBorder}>
            <InternPDFStudy  />
          </View>
        </Page>
    </Document>
  );
}
