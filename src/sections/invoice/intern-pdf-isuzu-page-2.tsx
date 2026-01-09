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
          // borderBottomWidth: 1,
          // borderRightWidth: 1,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
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
        tableCell_27: {
          // padding: '3px 0',
          width: '75%',
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
        tableCell_28: {
          // padding: '3px 0',
          width: '5%',
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
        tableCell_29: {
          // padding: '3px 0',
          width: '26%',
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
        tableCell_30: {
          // padding: '3px 0',
          width: `${22 / 3}%`,
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
          justifyContent: 'space-around',
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

export default function InternPDFIsuzuPage2({ invoice, stt }: Props) {
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
                        ⑥ アピールポイント Appeal Points etc.
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
                        styles.tableCell_5,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                        <Text>自己PR</Text>
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
                        <Text>Self-promotion</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_27,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{aim}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_5,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                        <Text>帰国後予定</Text>
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
                        <Text>Plans after Returning to Japan</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_27,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{plan}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_5,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                        <Text>長所</Text>
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
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>Strong Points</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_27,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{strong.join(', ')}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_5,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                        <Text>短所</Text>
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
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>Weak Points</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_27,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{weak.join(', ')}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_5,
                        {
                          paddingBottom: 0,
                          display: 'flex',
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
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
                        <Text>趣味</Text>
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
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>Hobby</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_27,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'left',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{interest}</Text>
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
                        ⑦ 既往症 Medical History
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
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>呼吸器系疾患</Text>
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
                        <Text>Respiratory Disease</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{respiratoryDisease ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>産科・女性系疾患</Text>
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
                        <Text>Obstetrics/Feminine dis.</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{obstetrics ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>高血圧</Text>
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
                        <Text>High blood pressure</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{highBloodPressure ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>眼科系疾患</Text>
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
                        <Text>Ophthalmological Diseases</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{ophthalmological ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>泌尿器系疾患</Text>
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
                        <Text>Urinary Diseases</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{urinaryDiseases ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>貧血</Text>
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
                        <Text>Anemia</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{anemia ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>耳鼻科系疾患</Text>
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
                        <Text>Otorhinolaryngological Dis.</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{otorhinolaryngological ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>脳神経・神経系疾患</Text>
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
                        <Text>Cranial Nerves</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{cranialNerves ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>頭痛・めまい</Text>
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
                        <Text>Headache/Dizziness</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{headache ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>咽頭系疾患</Text>
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
                        <Text>Pharyngeal System Disease</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{pharyngealSystemDisease ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>ヘルニア</Text>
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
                        <Text>Hernia</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{hernia ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>アレルギー</Text>
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
                        <Text>Any Allergies</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{anyAllergies ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>循環器内科系疾患</Text>
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
                        <Text>Cardiovascular Disease</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{cardiovascularDisease ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>リウマチ・関節炎等</Text>
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
                        <Text>Rheumatism, etc.</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{rheumatism ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>月経不順</Text>
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
                        <Text>Irregular menstruation</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{irregalerMenstruation ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>心臓疾患</Text>
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
                        <Text>Heart Disease</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{heartDisease ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>気絶・発作</Text>
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
                        <Text>Fainting/Seizure</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{fainting ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>結核検査・診断の経験</Text>
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
                        <Text>TB Test or diagnosis</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{tbTest ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>歯科系疾患</Text>
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
                        <Text>Dental Diseases</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{dental ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>糖尿</Text>
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
                        <Text>Diabetes</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{diabetes ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>家族での結核歴</Text>
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
                        <Text>History of TB in Family</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{history ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>消化器系疾患</Text>
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
                        <Text>digestive Dystem Dis.</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{digestive ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>喘息</Text>
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
                        <Text>Asthma</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{asthma ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>その他大きなケガ</Text>
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
                        <Text>Other Major Injuries</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{otherMajor ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>心療内科系疾患</Text>
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
                        <Text>Psychosomatic Medical</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{psychosomatic ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>不眠症</Text>
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
                        <Text>Vnsomnia</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{vnsomnia ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>手術歴</Text>
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
                        <Text>Surgery History</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{surgery ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>血液・腫瘍内科系疾患</Text>
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
                        <Text>Hematology/Ondiseases</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{hematology ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>腰痛症</Text>
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
                        <Text>Lower Back Pain</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{lowerBack ? "あり" : "なし"}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_29,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 0 },
                      ]}
                    >
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>入院歴</Text>
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
                        <Text>Hospitalization History</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_30,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{hospitalization ? "あり" : "なし"}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { paddingBottom: 0, borderRightWidth: 0 },
                      ]}
                    >
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            // height: '50%',
                            fontWeight: 'normal',
                            fontSize: 9,
                            textAlign: "left",
                            paddingLeft: "3px",
                            borderRightWidth: 1,
                          },
                        ]}
                      >
                        <Text>手術歴・入院歴・大きなケガなどがありの場合には詳細を記入する：</Text>
                      </View>
                    
                    </View>

                   
                  </View>
                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_12,
                        { paddingBottom: 0, borderRightWidth: 0 },
                      ]}
                    >
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            // height: '50%',
                            fontWeight: 'normal',
                            fontSize: 9,
                            textAlign: "left",
                            paddingLeft: "3px",
                            borderBottomWidth: 1,
                            borderRightWidth: 1
                          },
                        ]}
                      >
                        <Text>{others}</Text>
                      </View>
                    
                    </View>

                   
                  </View>
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
