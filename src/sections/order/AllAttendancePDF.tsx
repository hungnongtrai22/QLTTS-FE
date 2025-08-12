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
    position: "relative",
    zIndex: -1,
  },
  logoContainer: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-200%, -200%)', // căn giữa chính xác
    width: 400,
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoImage: {
    borderRadius: '50%',
        zIndex: 9999,

    // opacity: 0.1, // Giảm độ trong suốt để tạo hiệu ứng mờ
  },
});

export default function AllAttendancePDF({ intern, attendance, event }: any) {
  // console.log('INTERNS', intern);

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
            {/* <View style={styles.logoContainer}>
              <Image style={styles.logoImage} src="/assets/logo_new.png" />
            </View>  */}
            <InternPDFAttendance item={item} intern={intern} count={index + 1} event={event} />
          </View>
         
        </Page>
      ))}
    </Document>
  );
}
