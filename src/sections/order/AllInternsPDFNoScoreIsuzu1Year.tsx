import React from 'react';

import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import InternPDFIsuzu from '../invoice/intern-pdf-isuzu';
import InternPDFIsuzuPage2 from '../invoice/intern-pdf-isuzu-page-2';
import InternPDFHomeNoScore from '../invoice/intern-pdf-home-no-score';
import InternPDFIsuzuPage31Year from '../invoice/intern-pdf-isuzu-page-3-1year';

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
    // borderWidth: 1.5,
    // borderColor: 'black',
    // borderStyle: 'solid',
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

export default function AllInternsPDFNoScoreIsuzu1Year({ interns }: { interns: any[] }) {
  const internChunks = chunkArray(interns, 9); // chia interns ra từng nhóm 9 người

  return (
    <Document>
      {/* Mỗi nhóm interns (tối đa 9) được render bởi InternPDFHome trên một Page */}
      {internChunks.map((group, index) => {
        const startIndex = index * 9;
        return (
          <Page key={`home-${index}`} size="A4" orientation="landscape" style={styles.page}>
            <InternPDFHomeNoScore invoice={group} startIndex={startIndex} />
          </Page>
        );
      })}

      {interns.map((intern, index) => (
        <React.Fragment key={`detail-${index}`}>
          <Page size="A4" style={styles.page}>
            <View style={styles.pageBorder}>
              <InternPDFIsuzu invoice={intern} stt={index + 1} />
            </View>
          </Page>

          <Page size="A4" style={styles.page}>
            <View style={styles.pageBorder}>
              <InternPDFIsuzuPage2 invoice={intern} stt={index + 1} />
            </View>
          </Page>

          <Page size="A4" style={styles.page}>
            <View style={styles.pageBorder}>
              <InternPDFIsuzuPage31Year invoice={intern} stt={index + 1} />
            </View>
          </Page>
        </React.Fragment>
      ))}
    </Document>
  );
}
