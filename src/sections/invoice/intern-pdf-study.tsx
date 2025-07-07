import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// utils

import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';

// ----------------------------------------------------------------------

Font.register({
  family: 'Noto Sans JP',
  fonts: [{ src: '/fonts/NotoSansJP-Regular.ttf' }, { src: '/fonts/NotoSansJP-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8, paddingLeft: 3 },
        mb10: { marginBottom: 10 },
        pImage: { paddingHorizontal: 3, paddingTop: 3 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 12, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700, textAlign: 'center' },
        subtitle3: { fontSize: 12, fontWeight: 700, textAlign: 'center' },
        subtitle4: { fontSize: 5, color: '#919EAB' },
        titleBackground: {
          backgroundColor: '#D8DEE9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleNoBackground: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleBackgroundFinal: {
          backgroundColor: '#D8DEE9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          textAlign: 'left',
          paddingHorizontal: '3',
        },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Noto Sans JP',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          // padding: '40px 24px 120px 24px',
          padding: '10px 24px 10px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          // padding: '5px'
        },
        gridContainer1: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        table: {
          display: 'flex',
          width: '60%',
        },
        table1: {
          display: 'flex',
          width: '100%',
        },
        table40: {
          display: 'flex',
          width: '40%',
        },
        table60: {
          display: 'flex',
          width: '60%',
        },
        table30: {
          display: 'flex',
          width: '30%',
        },
        table10: {
          display: 'flex',
          width: '10%',
        },
        table45: {
          display: 'flex',
          width: '48%',
        },
        tableRow: {
          padding: 0,
          flexDirection: 'row',
          // borderWidth: 1, ❌ bỏ dòng này
          // borderBottomWidth: 0,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
          // padding: 0,
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '8%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          padding: '3px 0',
          margin: 0,
        },
        tableCell_2: {
          padding: '3px 0',
          width: '50%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_3: {
          width: '13.5%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
          margin: 0,
        },
        tableCell_5: {
          width: '25%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
          margin: 0,
        },
        tableCell_4: {
          width: '10.5%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
          margin: 0,
        },
        tableCell_6: {
          padding: '3px 0',
          width: '30%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_7: {
          padding: '3px 0',
          width: '40%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_8: {
          padding: '3px 0',
          width: '20%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_9: {
          padding: '3px 0',
          width: '35%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_10: {
          padding: '3px 0',
          width: '50%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_11: {
          padding: '3px 0',
          width: '75%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_12: {
          padding: '3px 0',
          width: '5%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_13: {
          padding: '3px 0',
          width: '100%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_14: {
          padding: '3px 0',
          width: '34%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_15: {
          padding: '3px 0',
          width: '65%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_16: {
          padding: '3px 0',
          width: '60%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_17: {
          padding: '3px 0',
          width: '40%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_18: {
          padding: '3px 0',
          width: '60%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_19: {
          padding: '3px 0',
          width: '10%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_20: {
          padding: '3px 0',
          width: '14%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_21: {
          padding: '3px 0',
          width: '27%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_22: {
          padding: '3px 0',
          width: '16.5%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_23: {
          padding: '3px 0',
          width: '7.5%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_24: {
          padding: '3px 0',
          width: '42.5%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        textLeft: {
          textAlign: 'left',
          paddingHorizontal: '3',
        },
        textCenter: {
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        },
        outerBorder: {
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'space-between',
          height: '100%',
        },
        spaceBorder: {
          flex: 1,
          // borderWidth: 1.5,
          // borderColor: 'red',
          // borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        autoBorder: {
          flex: 1,

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

const changMonthYearJP = (date: any) => {
  const jsDate = new Date(date);
  if (date === null || date === '') {
    return '';
  }
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月`;
  return customFormat;
};

function normalizeName(name: string): string {
  return name
    .normalize('NFD') // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd') // đ -> d
    .replace(/Đ/g, 'D') // Đ -> D
    .replace(/[^A-Za-z\s]/g, '') // Loại bỏ ký tự không phải chữ cái hoặc khoảng trắng
    .toUpperCase() // In hoa
    .trim() // Bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, ' '); // Chuẩn hóa khoảng trắng giữa các từ
}

const transPointToSharp = (point: number): string => {
  if (point < 50) return '×';
  if (point < 70) return '△';
  if (point < 80) return '○';
  if (point < 90) return '◎';
  return '●';
};

const transPointToGrade = (point: number): string => {
  if (point < 50) return 'C';
  if (point < 60) return 'B-';
  if (point < 70) return 'B';
  if (point < 80) return 'B+';
  if (point < 90) return 'A';
  return 'A+';
};

const evaluateStudent = (
  discipline: number,
  attitude: number,
  health: number,
  cooperation: number,
  attend: number,
  total: number
): string => {
  const hasCriticalFail =
    (discipline < 50 && attitude < 50) ||
    health < 50 ||
    cooperation < 50 ||
    attend < 50 ||
    total < 500;

  if (hasCriticalFail) return '不可';
  if (total < 700) return '可';
  if (total < 800) return '良';
  if (total < 900) return '優';
  return '秀';
};

const judgeJLPTResult = (
  level: string,
  kanji: number,
  grammarAndReading: number,
  listeningComprehension: number
): string => {
  const total = kanji + grammarAndReading + listeningComprehension;

  const isPass =
    kanji >= 19 &&
    grammarAndReading >= 19 &&
    listeningComprehension >= 19 &&
    ((level === 'N5' && total >= 80) || (level === 'N4' && total >= 90));

  return isPass ? '合' : '不';
};

export default function InternPDFStudy({ item, intern }: any) {
  // const {
  //   name,
  //   namejp,
  //   gender,
  //   height,
  //   weight,
  //   avatar,
  //   age,
  //   birthday,
  //   blood,
  //   married,
  //   BMI,
  //   leftEye,
  //   rightEye,
  //   blindColor,
  //   hand,
  //   driverLicense,
  //   address,
  //   smoke,
  //   alcohol,
  //   tattoo,
  //   school,
  //   company,
  //   family,
  //   interest,
  //   foreignLanguage,
  //   strong,
  //   weak,
  //   aim,
  //   plan,
  //   money,
  //   familyInJapan,
  //   moveForeign,
  // } = invoice;

  const styles = useStyles();
  console.log('intern', intern);
  console.log('study', item);

  return (
    <Document>
      <View style={styles.outerBorder}>
        <View style={[styles.gridContainer1, styles.mb10, styles.pImage]}>
          {/* <Image source="/assets/logo.png" style={{ width: 32, height: 32 }} /> */}

          <View>
            {/* <Text style={styles.h3}>{currentStatus}</Text> */}
            <Text style={styles.subtitle3}>技能実習生事前教育評価表</Text>
            {/* <Text style={styles.subtitle4}>
              8 TX01, Thanh Xuan Ward, District 12, Ho Chi Minh City, Vietnam
            </Text> */}
          </View>
        </View>
        <View style={styles.autoBorder}>
          <View>
            <View style={[styles.gridContainer, styles.mb10]}>
              <View style={styles.table}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>組合・管理団体の名称</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{intern.tradeUnion.name}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>受け入れ企業の名称</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{intern.companySelect.name}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>実習生の氏名</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{normalizeName(intern.name)}</Text>
                      <Text>{intern.namejp}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>性別</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{intern.gender}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>生年月日</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{changDateJP(intern.birthday)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>職種</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{intern.job}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>面接日</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{changDateJP(intern.interviewDate)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>入校日</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{changDateJP(intern.studyDate)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_10, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>出国予定日</Text>
                    </View>

                    <View style={[styles.tableCell_10, styles.textCenter]}>
                      <Text>{changMonthYearJP(intern.startDate)}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: '30%',
                  marginLeft: '40px',
                  // height: '111.5px',
                  // height: '80%',
                  border: 1,
                  // borderRight: 1,
                  borderStyle: 'solid',
                  borderColor: '#DFE3E8',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={intern.avatar}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.gridContainer, styles.mb10]}>
              <View style={styles.table}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View style={[styles.tableCell_5, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>報告日</Text>
                    </View>

                    <View style={[styles.tableCell_11, styles.textCenter]}>
                      <Text>{changDateJP(item.monthAndYear)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_5, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>報告期限</Text>
                    </View>

                    <View style={[styles.tableCell_11, styles.textCenter]}>
                      <Text>{item.time}ヶ月</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_5, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>報告機関</Text>
                    </View>

                    <View style={[styles.tableCell_11, styles.textCenter]}>
                      <Text>NHAT TAN 人材育成・提供有限会社</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_5, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>報告部署</Text>
                    </View>

                    <View style={[styles.tableCell_11, styles.textCenter]}>
                      <Text>教育部</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table40}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>(B) 一般評価</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_14, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>性格</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>健康</Text>
                      <Text style={styles.subtitle2}>状態</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>協調</Text>
                      <Text style={styles.subtitle2}>性</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>出席</Text>
                      <Text style={styles.subtitle2}>状況</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>規律</Text>
                      <Text style={styles.subtitle2}>厳守</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>学習</Text>
                      <Text style={styles.subtitle2}>態度</Text>
                    </View>
                    <View style={[styles.tableCell_3, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>オリエ</Text>
                      <Text style={styles.subtitle2}>ンテー</Text>
                      <Text style={styles.subtitle2}>ション</Text>
                      <Text style={styles.subtitle2}>知識</Text>
                      <Text style={styles.subtitle2}>の取</Text>
                      <Text style={styles.subtitle2}>得度</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table40}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>(C) 日本語能力・知識習得度</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={styles.table60}>
                      <View>
                        <View style={[styles.tableRow, { height: '40px' }]}>
                          <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>日本語能力</Text>
                          </View>
                        </View>
                        <View style={[styles.tableRow, { height: '53.5px' }]}>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>筆記</Text>
                            <Text style={styles.subtitle2}>力</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>読解</Text>
                            <Text style={styles.subtitle2}>力</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>聴解</Text>
                            <Text style={styles.subtitle2}>力</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>会話</Text>
                            <Text style={styles.subtitle2}>力</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.table10}>
                      <View>
                        <View style={[styles.tableRow, { height: '93.5px' }]}>
                          <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>学力</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.table30}>
                      <View>
                        <View style={[styles.tableRow, { height: '40px' }]}>
                          <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>日本語能力</Text>
                            <Text style={styles.subtitle2}>試験</Text>
                          </View>
                        </View>
                        <View style={[styles.tableRow, { height: '53.5px' }]}>
                          <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>レベ</Text>
                            <Text style={styles.subtitle2}>ル</Text>
                          </View>
                          <View style={[styles.tableCell_15, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>合格</Text>
                            <Text style={styles.subtitle2}>判定</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table10}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View
                      style={[styles.tableCell_13, styles.titleNoBackground, { height: '115px' }]}
                    >
                      <Text style={styles.subtitle2}>(D)</Text>
                      <Text style={styles.subtitle2}>総合</Text>
                      <Text style={styles.subtitle2}>評価</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table10}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
                    <View
                      style={[styles.tableCell_13, styles.titleNoBackground, { height: '115px' }]}
                    >
                      <Text style={styles.subtitle2}>学習進</Text>
                      <Text style={styles.subtitle2}>捗</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.gridContainer, styles.mb10]}>
              <View style={styles.table40}>
                <View>
                  <View style={[styles.tableRow, { height: '40px' }]}>
                    <View style={[styles.tableCell_14, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{item.characteristic}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{transPointToSharp(item.health)}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{transPointToSharp(item.cooperation)}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{transPointToSharp(item.attend)}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{transPointToSharp(item.discipline)}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{transPointToSharp(item.attitude)}</Text>
                    </View>
                    <View style={[styles.tableCell_3, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>
                        {transPointToSharp(item.acquiringKnowledge)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table40}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View style={styles.table60}>
                      <View>
                        <View style={[styles.tableRow, { height: '40px' }]}>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{transPointToSharp(item.write)}</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{transPointToSharp(item.read)}</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{transPointToSharp(item.listen)}</Text>
                          </View>
                          <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{transPointToSharp(item.speak)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.table10}>
                      <View>
                        <View style={[styles.tableRow, { height: '40px' }]}>
                          <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{transPointToGrade(item.average)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.table30}>
                      <View>
                        <View style={[styles.tableRow, { height: '40px' }]}>
                          <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>{item.level}</Text>
                          </View>
                          <View style={[styles.tableCell_15, styles.titleNoBackground]}>
                            <Text style={styles.subtitle2}>
                              {judgeJLPTResult(
                                item.level,
                                item.kanji,
                                item.grammarAndReading,
                                item.listeningComprehension
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table10}>
                <View>
                  <View style={[styles.tableRow, { height: '40px' }]}>
                    <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>
                        {evaluateStudent(
                          item.discipline,
                          item.attitude,
                          item.health,
                          item.cooperation,
                          item.attend,
                          item.total
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table10}>
                <View>
                  <View style={[styles.tableRow, { height: '40px' }]}>
                    <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>{item.learningProcess}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.gridContainer, styles.mb10]}>
              <View style={styles.table1}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: '1px' }]}>
                    <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                      <Text style={styles.subtitle2}>
                        {htmlToText(item.comment, {
                          wordwrap: false,
                          preserveNewlines: true,
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.gridContainer, styles.mb10]}>
              <View style={styles.spaceBorder}>
                <View style={styles.table45}>
                  <View>
                    <View style={[styles.tableRow, { borderTopWidth: '1px' }]}>
                      <View style={[styles.tableCell_17, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>(B) (C)</Text>
                      </View>
                      <View style={[styles.tableCell_18, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>(D)総合評価</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>●</Text>
                      </View>
                      <View style={[styles.tableCell_8, styles.titleNoBackground]}>
                        <Text>＜100点</Text>
                      </View>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>秀</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text>100%</Text>
                      </View>
                      <View style={[styles.tableCell_21, styles.titleNoBackground]}>
                        <Text>(D) ＜1000満点</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>秀</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>◎</Text>
                      </View>
                      <View style={[styles.tableCell_8, styles.titleNoBackground]}>
                        <Text>＜90点</Text>
                      </View>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>優</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text>90%</Text>
                      </View>
                      <View style={[styles.tableCell_21, styles.titleNoBackground]}>
                        <Text>(D) ＜900点</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>優</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>○</Text>
                      </View>
                      <View style={[styles.tableCell_8, styles.titleNoBackground]}>
                        <Text>＜80点</Text>
                      </View>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>良</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text>80%</Text>
                      </View>
                      <View style={[styles.tableCell_21, styles.titleNoBackground]}>
                        <Text>(D) ＜800点</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>良</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>△</Text>
                      </View>
                      <View style={[styles.tableCell_8, styles.titleNoBackground]}>
                        <Text>＜70点</Text>
                      </View>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>可</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text>70%</Text>
                      </View>
                      <View style={[styles.tableCell_21, styles.titleNoBackground]}>
                        <Text>(D) ＜700点</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>可</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>×</Text>
                      </View>
                      <View style={[styles.tableCell_8, styles.titleNoBackground]}>
                        <Text>＜50点</Text>
                      </View>
                      <View style={[styles.tableCell_19, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>不可</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text>50%以下</Text>
                      </View>
                      <View style={[styles.tableCell_21, styles.titleNoBackground]}>
                        <Text>(D) ＜500点</Text>
                      </View>
                      <View style={[styles.tableCell_22, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>不可</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.table45}>
                  <View>
                    <View
                      style={[styles.tableRow, { borderTopWidth: '1px', borderLeftWidth: '1px' }]}
                    >
                      <View style={[styles.tableCell_13, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>（C）学力</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow, { borderLeftWidth: '1px' }]}>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>90点≦平均点数≦100点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>A+</Text>
                      </View>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>60点≦平均点数＜70点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>B</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow, { borderLeftWidth: '1px' }]}>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>80点≦平均点数＜90点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>A</Text>
                      </View>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>50点≦平均点数＜60点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>B-</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow, { borderLeftWidth: '1px' }]}>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>70点≦平均点数＜80点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>B+</Text>
                      </View>
                      <View style={[styles.tableCell_24, styles.titleNoBackground]}>
                        <Text>0点≦平均点数＜50点</Text>
                      </View>
                      <View style={[styles.tableCell_23, styles.titleNoBackground]}>
                        <Text style={styles.subtitle2}>C</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Document>
  );
}
