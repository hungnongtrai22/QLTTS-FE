/* eslint-disable arrow-body-style */

import { Document, Page, View, StyleSheet, Font } from '@react-pdf/renderer';
import InternPDFStudy from '../invoice/intern-pdf-study';


const hyphenationCallback = (word: string) => {
  return [word];
};

Font.registerHyphenationCallback(hyphenationCallback);

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


export default function AllStudyPDF({ intern, study }: any) {
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

      {study.map((item: any, index: any) => (
        <Page size="A4" style={styles.page} key={index}>
          <View style={styles.pageBorder}>
            <InternPDFStudy item={item} intern={intern} />
          </View>
        </Page>
      ))}
    </Document>
  );
}
