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
import type { HyphenationCallback } from '@react-pdf/types';

// ----------------------------------------------------------------------

Font.register({
  family: 'Noto Sans JP',
  fonts: [{ src: '/fonts/NotoSansJP-Regular.ttf' }, { src: '/fonts/NotoSansJP-Bold.ttf' }],
});

Font.registerHyphenationCallback((word: string) => [word]);


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
          borderTopWidth: 1,
          // borderRightWidth: 1,
          borderLeftWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
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
          width: '65%',
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
        tableCell_31: {
          // padding: '3px 0',
          width: `${40 / 3}%`,
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
        tableCell_32: {
          // padding: '3px 0',
          width: '25.5%',
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
        tableCell_33: {
          // padding: '3px 0',
          width: '3%',
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
        tableCell_34: {
          width: '12.5%',
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
        tableCell_35: {
          width: '70%',
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
          tableCell_36: {
          width: '100%',
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

export default function InternPDFIsuzuPage3({ invoice, stt }: Props) {
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

const noHyphenation: HyphenationCallback = (word) => [word];


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
                        ⑧ 身体測定データ Physical Measurement
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
                    <View style={[styles.tableCell_17, { paddingBottom: 0, borderRightWidth: 0 }]}>
                      <View
                        style={[
                          styles.subtitle2,
                          // styles.textCenter,
                          {
                            // borderBottomWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            // height: '50%',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>身長</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 9,
                          fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>体重</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>利き手</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 9,
                          fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>視力</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>色盲</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>血液型</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell_17, { paddingBottom: 0, borderRightWidth: 0 }]}>
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
                            fontSize: 8,
                          },
                        ]}
                      >
                        <Text>Height</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 8,
                          // fontWeight: 700
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>Weight</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 8,
                          // fontWeight: 700
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>Dominant Hand</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 8,
                          // fontWeight: 700
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>Eyesight</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 8,
                          // fontWeight: 700
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>Color Blindness</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 8,
                          // fontWeight: 700,
                          // paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>Blood Group</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 9,
                          // fontWeight: 700
                          paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{height} cm</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_17,
                        {
                          fontSize: 9,
                          // fontWeight: 700
                          paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{weight} Kg</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          // fontWeight: 700
                          paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{hand}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_17,
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
                            display: 'flex',
                            flexDirection: 'row',
                            // justifyContent: 'space-between',
                            borderBottomWidth: 1,
                          },
                        ]}
                      >
                        <Text style={{ textAlign: 'center', flex: 1 }}>右 Right</Text>
                        <Text style={{ textAlign: 'center', flex: 1 }}>左 Left</Text>
                      </View>
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
                            display: 'flex',
                            flexDirection: 'row',
                            // justifyContent: 'space-between',
                            borderBottomWidth: 1,
                          },
                        ]}
                      >
                        <Text style={{ textAlign: 'center', flex: 1 }}>{rightEye}</Text>
                        <Text style={{ textAlign: 'center', flex: 1 }}>{leftEye}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          // fontWeight: 700
                          paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{blindColor === true ? 'あり' : 'なし'}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_31,
                        {
                          fontSize: 9,
                          // fontWeight: 700,
                          paddingVertical: '9px',
                          // textAlign: 'left',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{blood}</Text>
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
                        ⑨ その他 Others
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
                        styles.tableCell_32,
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
                        <Text>想定手取り（毎月）</Text>
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
                        <Text>Estimated Monthly Income</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_3,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{moneyMonthFrom}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>円</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>～</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_3,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{moneyMonthTo}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>円</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_32,
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
                        <Text>宗教</Text>
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
                        <Text>Religion</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_4,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{religion}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_32,
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>想定収入（3年間）</Text>
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
                        <Text>Estimated 3 Years Income</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_3,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{money3YearsFrom}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>円</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>～</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_3,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{money3YearsTo}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_33,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>円</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell_32,
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
                            fontWeight: 'normal',
                            fontSize: 9,
                          },
                        ]}
                      >
                        <Text>来日前に結婚する予定</Text>
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
                        <Text>Planning to get Married</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_4,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <Text>{planMarried}</Text>
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
                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_13,
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
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>
                          過去に犯罪を理由する処分を受けたことが有無（ベトナム国外も含む）
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>
                          Have you ever been punished for a crime in the past (including outside
                          Vietnam)
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_28,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{crime ? '■' : '□'}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_34,
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
                        <Text>あり</Text>
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
                        <Text>Yes, I have</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_28,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{crime ? '■' : '□'}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_34,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 1 },
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
                        <Text>なし</Text>
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
                        <Text>No, I have not </Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_6,
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
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>ありの場合具体的内容 ：</Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>If yes, please provide specific details.</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_35,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{crimeDetail}</Text>
                    </View>
                  </View>

                   <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_13,
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
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>
                          入れ墨がありますか？
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            flex: 1,
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            textAlign: 'left',
                            paddingLeft: '3px',
                          },
                        ]}
                      >
                        <Text>
                          Do you have any tattoos or body art?
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableCell_28,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{tattoo ? '■' : '□'}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_34,
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
                        <Text>あり</Text>
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
                        <Text>Yes, I have</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.tableCell_28,
                        {
                          fontSize: 9,
                          paddingVertical: '9px',
                          textAlign: 'center',
                          // paddingLeft: '3px',
                          // borderRightWidth: 1,
                        },
                      ]}
                    >
                      <Text>{tattoo ? '■' : '□'}</Text>
                    </View>

                    <View
                      style={[
                        styles.tableCell_34,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 1 },
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
                        <Text>なし</Text>
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
                        <Text>No, I have not </Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.tableRow]}>
                    <View
                      style={[
                        styles.tableCell_36,
                        { paddingBottom: 0, display: 'flex', borderRightWidth: 1, paddingVertical: '9px', borderBottomWidth: 1 },
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
                            // flex: 1,
                            // height: '50%',
                            fontWeight: 'normal',
                            fontSize: 9,
                            textAlign: 'left',
                            paddingLeft: '15px',
                          },
                        ]}
                      >
                        <Text>
                          申告内容に虚偽があった場合には、労使間の信頼関係を毀損するものとして、内定取消しとなる可能性があります
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.subtitle2,
                          // , styles.textCenter,
                          {
                            // flex: 1,
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            fontWeight: 'normal',
                            fontSize: 8,
                            textAlign: 'left',
                            paddingLeft: '15px',
                          },
                        ]}
                      >
                        <Text>
                          If any of the information contained in the declaration is false, it may result in the offer of employment being revoked as it will damage the trust between labor and management.
                        </Text>
                      </View>
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
                        ⑪ 備考欄 （Fill in Column）
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
                        styles.tableCell_36,
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
                      <Text>{fillInfo}</Text>
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
