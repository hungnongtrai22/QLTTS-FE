/* eslint-disable no-irregular-whitespace */

import { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Document,
  Font,
  StyleSheet,
  Svg,
  Path,
  Rect,
} from '@react-pdf/renderer';
// utils

import { IInternItem } from 'src/types/user';
import dayjs from 'dayjs';
import { fontSize } from '@mui/system';

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
        subtitle4: { fontSize: 5, color: '#919EAB' },
        titleBackground: {
          backgroundColor: '#D8DEE9',
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
          flexDirection: 'row',
          justifyContent: 'flex-start',
        },
        gridContainer1: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: '80%',
        },
        table1: {
          display: 'flex',
          width: '100%',
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
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderTopWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_3: {
          width: '15%',
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          height: '100%',
          // padding: '3px 0',
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
          width: '10%',
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          height: '100%',
          // padding: '3px 0',
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
          // padding: '3px 0',
          width: '20%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
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
          // padding: '3px 0',
          width: '55%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_12: {
          // padding: '3px 0',
          width: '100%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_13: {
          // padding: '3px 0',
          width: '70%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_14: {
          // padding: '3px 0',
          width: '85%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_15: {
          // padding: '3px 0',
          width: '12%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_16: {
          // padding: '3px 0',
          width: '68%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_17: {
          // padding: '3px 0',
          width: '20%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_18: {
          // padding: '3px 0',
          width: '4%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_19: {
          // padding: '3px 0',
          width: '8%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_20: {
          // padding: '3px 0',
          width: '52%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_21: {
          // padding: '3px 0',
          width: '56%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_22: {
          // padding: '3px 0',
          width: '33%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_23: {
          // padding: '3px 0',
          width: '31%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_24: {
          // padding: '3px 0',
          width: '25%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_25: {
          // padding: '3px 0',
          width: '19%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          margin: 0,
        },
        tableCell_26: {
          // padding: '3px 0',
          width: '11%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
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
          height: '100%',
        },
        spaceBorder: {
          flex: 1,
          // borderWidth: 1.5,
          // borderColor: 'red',
          // borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  invoice: IInternItem;
  stt?: any;
};

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

export default function InternPDFIsuzu({ invoice, stt }: Props) {
  const {
    name,
    namejp,
    gender,
    height,
    weight,
    avatar,
    age,
    birthday,
    blood,
    married,
    BMI,
    leftEye,
    rightEye,
    blindColor,
    hand,
    driverLicense,
    address,
    smoke,
    alcohol,
    tattoo,
    school,
    company,
    family,
    interest,
    foreignLanguage,
    strong,
    weak,
    aim,
    plan,
    money,
    familyInJapan,
    moveForeign,
    type,
    birthPlace,
    email,
    phoneNumber,
    children,
    respiratoryDisease,
    obstetrics,
    highBloodPressure,
    ophthalmological,
    urinaryDiseases,
    anemia,
    otorhinolaryngological,
    cranialNerves,
    headache,
    pharyngealSystemDisease,
    hernia,
    anyAllergies,
    cardiovascularDisease,
    rheumatism,
    irregalerMenstruation,
    heartDisease,
    fainting,
    tbTest,
    dental,
    diabetes,
    history,
    digestive,
    asthma,
    otherMajor,
    psychosomatic,
    vnsomnia,
    surgery,
    hematology,
    lowerBack,
    hospitalization,
    others,
    moneyMonthFrom,
    moneyMonthTo,
    money3YearsFrom,
    money3YearsTo,
    religion,
    planMarried,
    crime,
    crimeDetail,
    fillInfo,
  } = invoice;

  console.log('Test', company);

  const CheckboxChecked = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      {/* Hộp: Nền trắng, Viền đen, Bo góc nhẹ (rx="3") */}
      <Rect x="2" y="2" width="20" height="20" rx="3" fill="white" stroke="black" strokeWidth="2" />

      {/* Dấu tích: Màu đen */}
      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="black" />
    </Svg>
  );

  const CheckboxUnchecked = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      {/* Hộp: Nền trắng, Viền đen, Bo góc nhẹ (rx="3") */}
      <Rect x="2" y="2" width="20" height="20" rx="3" fill="white" stroke="black" strokeWidth="2" />
    </Svg>
  );

  const styles = useStyles();

  return (
    <Document>
      <View style={styles.outerBorder}>
        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table1}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_11]}>
                  <Text style={styles.subtitle2}> </Text>
                </View>

                <View style={[styles.tableCell_3, styles.textCenter]}>
                  <Text style={[styles.subtitle2, { fontSize: 14 }]}>候補者No.</Text>
                </View>

                <View style={[styles.tableCell_4, styles.textCenter]}>
                  <Text
                    style={[
                      styles.subtitle2,
                      { fontSize: 24, fontWeight: 'bold', color: '#0070C0' },
                    ]}
                  >
                    {stt}
                  </Text>
                </View>

                <View style={[styles.tableCell_8, { paddingBottom: 0, display: 'flex' }]}>
                  <View
                    style={[
                      styles.subtitle2,
                      // styles.textCenter,
                      {
                        borderBottomWidth: 1,
                        borderStyle: 'solid',
                        borderColor: 'black',
                        flex: 1,
                        // height: '50%',
                        fontSize: 11,
                      },
                    ]}
                  >
                    <Text>履歴書作成日</Text>
                  </View>
                  <View
                    style={[
                      styles.subtitle2,
                      // , styles.textCenter,
                      {
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 11,
                      },
                    ]}
                  >
                    <Text>{changDateJP(new Date().toISOString())}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_2, { fontSize: 18 }]}>
                  <Text
                    style={[
                      styles.subtitle2,
                      { textAlign: 'right', marginRight: '5px', fontSize: 18 },
                    ]}
                  >
                    履歴書
                  </Text>
                </View>

                <View
                  style={[
                    styles.tableCell_2,
                    {
                      fontSize: 14,
                      borderLeftWidth: 0,
                      borderRightWidth: 1,
                      display: 'flex',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.subtitle2,
                      { textAlign: 'left', marginLeft: '5px', fontSize: 14 },
                    ]}
                  >
                    RESUME
                  </Text>
                </View>
              </View>

              {/* {Array.from({ length: 4 - school.length }).map((_, idx) => (
                    <View style={styles.tableRow} key={`empty-${idx}`}>
                      <View style={[styles.tableCell_6, styles.textCenter]}>
                        <Text> </Text>
                      </View>

                      <View style={[styles.tableCell_7, styles.textCenter]}>
                        <Text> </Text>
                      </View>

                      <View style={[styles.tableCell_8, styles.textCenter]}>
                        <Text> </Text>
                      </View>

                      <View style={[styles.tableCell_4, styles.textCenter]}>
                        <Text> </Text>
                      </View>
                    </View>
                  ))} */}
            </View>

            <View>
              {/* {items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))} */}
            </View>
          </View>
        </View>
        <View style={styles.spaceBorder}>
          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { backgroundColor: '#C5D9F1', borderRightWidth: 1, paddingLeft: '5px' },
                      ]}
                    >
                      <Text style={[styles.subtitle2, { fontSize: 12, textAlign: 'left' }]}>
                        ① 候補者個人データ Personal Information
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.gridContainer, { marginBottom: 0 }]}>
              <View style={styles.table}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_3, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>フリガナ</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Furigana</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_13, { fontSize: 14, paddingVertical: '3px' }]}>
                      <Text>{namejp}</Text>
                    </View>

                    <View style={[styles.tableCell_3, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>性別</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Sex</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_3, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>氏名</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Full Name</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_13, { fontSize: 14, paddingVertical: '3px' }]}>
                      <Text>{normalizeName(name)}</Text>
                    </View>

                    <View style={[styles.tableCell_3, styles.textCenter]}>
                      <Text>{gender}性</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_3, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>生年月日</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Date of Birth</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_13, { fontSize: 12, paddingVertical: '3px' }]}>
                      <Text>{changDateJP(birthday)}</Text>
                    </View>

                    <View style={[styles.tableCell_3, styles.textCenter]}>
                      <Text>{age}歳</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_3, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>出身地</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Birth Place</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_14,
                        {
                          fontSize: 9,
                          paddingVertical: '6px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                        },
                      ]}
                    >
                      <Text>{birthPlace}</Text>
                    </View>
                  </View>

                  {/* <View style={styles.tableRow}>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>生年月日</Text>
                    </View>

                    <View style={[styles.tableCell_6, styles.textCenter]}>
                      <Text>{changDateJP(birthday)}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>血液型</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{blood}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>配偶者</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{married}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>BMI</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{BMI}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>視力</Text>
                    </View>

                    <View style={[styles.tableCell_6, styles.textCenter]}>
                      <Text>{`左目: ${leftEye} - 右目: ${rightEye}`}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>色弱</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{blindColor === true ? 'あり' : 'なし'}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>利き手</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{hand}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>運転免許</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{driverLicense}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>現住所</Text>
                    </View>

                    <View style={[styles.tableCell_6, styles.textCenter]}>
                      <Text>{address}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>喫煙</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{smoke === true ? 'あり' : 'なし'}</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>飲酒</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{alcohol === true ? 'あり' : 'なし'}</Text>
                    </View>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>入れ墨</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.textCenter]}>
                      <Text>{tattoo === true ? 'あり' : 'なし'}</Text>
                    </View>
                  </View> */}
                </View>

                <View>
                  {/* {items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))} */}
                </View>
              </View>
              <View
                style={{
                  width: '20%',
                  // height: '111.5px',
                  // height: '80%',
                  // borderBottom: 1,
                  // borderRight: 1,
                  border: 1,
                  borderBottom: 0,
                  marginBottom: 0,
                  borderStyle: 'solid',
                  borderColor: 'black',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={avatar}
                  style={{
                    width: '100%',
                    height: address?.length > 21 ? '111px' : '106px',
                    objectFit: 'contain',
                  }}
                />
              </View>
            </View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_15, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>現住所</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Current Address</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_16,
                        {
                          fontSize: 9,
                          paddingVertical: '6px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                        },
                      ]}
                    >
                      <Text>{address}</Text>
                    </View>

                    <View style={[styles.tableCell_17, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>電話番号</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Phone Number</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_15, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>メールアドレス</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>E-mail Address</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_16,
                        {
                          fontSize: 9,
                          paddingVertical: '6px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                        },
                      ]}
                    >
                      <Text>{email}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 9,
                          paddingVertical: '6px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{phoneNumber}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_15, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>配偶者</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            borderBottomWidth: 1,
                          },
                        ]}
                      >
                        <Text>Marital Status</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell_18]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            paddingVertical: '7.1px',
                            fontSize: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}
                      >
                        <View>
                          {!(married === '既婚') ? <CheckboxChecked /> : <CheckboxUnchecked />}
                        </View>
                      </View>
                    </View>
                    <View style={[styles.tableCell_19, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>無</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            borderBottomWidth: 1,
                          },
                        ]}
                      >
                        <Text>Single</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell_18]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            paddingVertical: '7.1px',
                            fontSize: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}
                      >
                        <View>
                          {married === '既婚' ? <CheckboxChecked /> : <CheckboxUnchecked />}
                        </View>
                      </View>
                    </View>
                    <View style={[styles.tableCell_19, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>有</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            borderBottomWidth: 1,
                          },
                        ]}
                      >
                        <Text>Married</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell_15, { paddingBottom: 0, display: 'flex' }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            // borderRightWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>子供</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            borderBottomWidth: 1,
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Children</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_20,
                        {
                          fontSize: 9,
                          paddingVertical: '6px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{children}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { backgroundColor: '#C5D9F1', borderRightWidth: 1, paddingLeft: '5px' },
                      ]}
                    >
                      <Text style={[styles.subtitle2, { fontSize: 12, textAlign: 'left' }]}>
                        ② 学歴 Educational History
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>年　月</Text>
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>年　月</Text>
                      </Text>
                    </View>

                    <View style={[styles.tableCell_21, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>学校名</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_17, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>卒業証明書の有無</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Enrollment Date</Text>
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Graduation Date</Text>
                      </Text>
                    </View>

                    <View style={[styles.tableCell_21, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal', // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Name of the School / College</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_17, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Graduation Certificate</Text>
                      </View>
                    </View>
                  </View>
                  {school.map((item: any, index: any) => (
                    <View style={[styles.tableRow]} key={index}>
                      <View
                        style={[
                          styles.tableCell_15,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal',
                            },
                          ]}
                        >
                          <Text>{changMonthYearJP(item.timeFrom)}</Text>
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.tableCell_15,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal',
                            },
                          ]}
                        >
                          <Text>
                            {dayjs(item.timeTo).isSame(dayjs(), 'month') &&
                            dayjs(item.timeTo).isSame(dayjs(), 'year')
                              ? '現在'
                              : changMonthYearJP(item.timeTo)}
                          </Text>
                        </Text>
                      </View>

                      <View style={[styles.tableCell_21, { paddingBottom: 0, borderTopWidth: 0 }]}>
                        <View
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              borderBottomWidth: 1,
                              borderTopWidth: 0,
                              borderStyle: 'solid',
                              borderColor: 'black',
                              flex: 1,
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal', // borderRightWidth: 1,
                            },
                          ]}
                        >
                          <Text>
                            {item.name} ({item.content})
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.tableCell_17, { paddingBottom: 0, borderTopWidth: 0 }]}>
                        <View
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              borderBottomWidth: 1,
                              borderStyle: 'solid',
                              borderColor: 'black',
                              flex: 1,
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal',
                              borderTopWidth: 0,
                              borderRightWidth: 1,
                            },
                          ]}
                        >
                          <Text>{item.current}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { backgroundColor: '#C5D9F1', borderRightWidth: 1, paddingLeft: '5px' },
                      ]}
                    >
                      <Text style={[styles.subtitle2, { fontSize: 12, textAlign: 'left' }]}>
                        ③ 職歴 Working Background
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>年　月</Text>
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>年　月</Text>
                      </Text>
                    </View>

                    <View style={[styles.tableCell_15, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>職業</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_23, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>会社</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell_22, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>住所</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Joining Date</Text>
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Resignation</Text>
                      </Text>
                    </View>

                    <View style={[styles.tableCell_15, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Profession</Text>
                      </View>
                    </View>

                    <View style={[styles.tableCell_23, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                            // borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Name of the Company</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell_22, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Address</Text>
                      </View>
                    </View>
                  </View>
                  {company?.length > 0 &&
                    company?.[0].name &&
                    company?.map((item: any, index: any) => (
                      <View style={[styles.tableRow]} key={index}>
                        <View
                          style={[
                            styles.tableCell_15,
                            {
                              paddingBottom: 0,
                              borderBottomWidth: 1,
                              borderTopWidth: 0,
                              borderStyle: 'solid',
                              borderColor: 'black',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.subtitle2,
                              // styles.textCenter,
                              {
                                // height: '50%',
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                fontSize: 8,
                                fontWeight: 'normal',
                              },
                            ]}
                          >
                            <Text>{changMonthYearJP(item.timeFrom)}</Text>
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.tableCell_15,
                            {
                              paddingBottom: 0,
                              borderBottomWidth: 1,
                              borderTopWidth: 0,
                              // borderBottomWidth: 1,
                              borderStyle: 'solid',
                              borderColor: 'black',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.subtitle2,
                              // styles.textCenter,
                              {
                                // height: '50%',
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                fontSize: 8,
                                fontWeight: 'normal',
                              },
                            ]}
                          >
                            <Text>
                              {dayjs(item.timeTo).isSame(dayjs(), 'month') &&
                              dayjs(item.timeTo).isSame(dayjs(), 'year')
                                ? '現在'
                                : changMonthYearJP(item.timeTo)}
                            </Text>
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.tableCell_15,
                            { paddingBottom: 0, borderBottomWidth: 1, borderTopWidth: 0 },
                          ]}
                        >
                          <View
                            style={[
                              styles.subtitle2,
                              // styles.textCenter,
                              {
                                // borderBottomWidth: 1,
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                flex: 1,
                                // height: '50%',
                                fontSize: 8,
                                fontWeight: 'normal',
                                // borderRightWidth: 1,
                              },
                            ]}
                          >
                            <Text>{item.content}</Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.tableCell_23,
                            { paddingBottom: 0, borderBottomWidth: 1, borderTopWidth: 0 },
                          ]}
                        >
                          <View
                            style={[
                              styles.subtitle2,
                              // styles.textCenter,
                              {
                                // borderBottomWidth: 1,
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                flex: 1,
                                // height: '50%',
                                fontSize: 8,
                                fontWeight: 'normal',
                                // borderRightWidth: 1,
                              },
                            ]}
                          >
                            <Text>{item.name}</Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.tableCell_22,
                            { paddingBottom: 0, borderBottomWidth: 1, borderTopWidth: 0 },
                          ]}
                        >
                          <View
                            style={[
                              styles.subtitle2,
                              // styles.textCenter,
                              {
                                // borderBottomWidth: 1,
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                // flex: 1,
                                // height: '50%',
                                fontSize: 8,
                                fontWeight: 'normal',
                                borderRightWidth: 1,
                              },
                            ]}
                          >
                            <Text>{item.address}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          </View>

          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { backgroundColor: '#C5D9F1', borderRightWidth: 1, paddingLeft: '5px' },
                      ]}
                    >
                      <Text style={[styles.subtitle2, { fontSize: 12, textAlign: 'left' }]}>
                        ④ 家族構成 Family
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table1}>
                <View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_24,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>氏名</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_26,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>関係</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_25,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>生年月日</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          // borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>職業</Text>
                      </Text>
                    </View>
                    <View style={[styles.tableCell_22, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 9,
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>住所</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_24,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Name</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_26,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Relationship</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_25,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Date of birth</Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_15,
                        {
                          paddingBottom: 0,
                          borderBottomWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'black',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                          },
                        ]}
                      >
                        <Text>Occupation</Text>
                      </Text>
                    </View>
                    <View style={[styles.tableCell_22, { paddingBottom: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            flex: 1,
                            // height: '50%',
                            fontSize: 8,
                            fontWeight: 'normal',
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>Current Address</Text>
                      </View>
                    </View>
                  </View>
                  {family.map((item: any, index: any) => (
                    <View style={[styles.tableRow]} key={index}>
                      <View
                        style={[
                          styles.tableCell_24,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              borderTopWidth: 0,
                              fontSize: 8,
                              fontWeight: 'normal',
                            },
                          ]}
                        >
                          <Text>{item.name}</Text>
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell_26,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal',
                              borderTop: 0,
                            },
                          ]}
                        >
                          <Text>{item.relationship}</Text>
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell_25,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              borderTopWidth: 0,
                              fontSize: 8,
                              fontWeight: 'normal',
                            },
                          ]}
                        >
                          <Text>{item.year ? new Date(item.year).getFullYear() : '死亡'}</Text>
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell_15,
                          {
                            paddingBottom: 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 0,
                            borderStyle: 'solid',
                            borderColor: 'black',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              // height: '50%',
                              borderTopWidth: 0,
                              fontSize: 8,
                              fontWeight: 'normal',
                            },
                          ]}
                        >
                          <Text>{item.occupation}</Text>
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell_22,
                          { paddingBottom: 0, borderBottomWidth: 1, borderTopWidth: 0 },
                        ]}
                      >
                        <View
                          style={[
                            styles.subtitle2,
                            // styles.textCenter,
                            {
                              //  borderBottomWidth: 1,
                              borderTopWidth: 0,
                              borderStyle: 'solid',
                              borderColor: 'black',
                              flex: 1,
                              // height: '50%',
                              fontSize: 8,
                              fontWeight: 'normal',
                              borderRightWidth: 1,
                            },
                          ]}
                        >
                          <Text>{item.location}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text>nhattan@nhattangroup.vn</Text>
          </View>
        </View> */}
      </View>
    </Document>
  );
}
