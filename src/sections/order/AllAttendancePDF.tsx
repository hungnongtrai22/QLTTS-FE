import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';


import InternPDFAttendance from '../invoice/intern-pdf-attendance';

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

export default function AllAttendancePDF({ intern, attendance,event }: any) {

  console.log("INTERNS", intern);


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

      {/* {study.map((item: any, index: any) => (
        <Page size="A4" style={styles.page} key={index} orientation="landscape">
          <View style={styles.pageBorder}>
            <InternPDFStudy item={item} intern={intern} />
          </View>
        </Page>
      ))} */}
      {attendance.map((item: any, index: any) => (
        <Page size="A4" key={index} style={styles.page} orientation="landscape">
          <View style={styles.pageBorder}>
            <InternPDFAttendance item={item} intern={intern} count={index + 1} event={event}/>
          </View>
        </Page>
      ))}
    </Document>
  );
}
