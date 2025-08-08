/* eslint-disable no-nested-ternary, no-restricted-syntax */

import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
import InternPDFAttendanceItem from './view/intern-pdf-item';
// utils

// import dayjs from 'dayjs';
// import { htmlToText } from 'html-to-text';
// import axios from 'axios';

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
          // backgroundColor: '#578FCA',
                    backgroundColor: '#A6E3E9',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleBackgroundYellow: {
          // backgroundColor: '#FADA7A',
          // backgroundColor: '#F9ED69',
          backgroundColor: '#FFFFD2',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleBackgroundSS: {
          backgroundColor: '#FFFBDE',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleBackgroundRed: {
          // backgroundColor: '#E14434',
          // backgroundColor: '#E84545',
          backgroundColor: '#F67280',
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
        table10: {
          display: 'flex',
          width: '10%',
        },
        table20: {
          display: 'flex',
          width: '20%',
          zIndex: -1,
        },
        table18: {
          display: 'flex',
          width: '18%',
        },
        table2: {
          display: 'flex',
          width: '2%',
        },
        table70: {
          display: 'flex',
          width: '70%',
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
          width: '10%',
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
        tableCell_25: {
          padding: '3px 0',
          width: '80%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_26: {
          padding: '3px 0',
          width: 'calc(100% / 31)',
          height: '100%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_27: {
          padding: '3px 0',
          width: 'calc(100% / 3)',
          height: '100%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_28: {
          padding: '3px 0',
          width: '11.11%',
          height: '100%',
          textAlign: 'center',
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          margin: 0,
        },
        tableCell_29: {
          padding: '3px 0',
          width: '88.89%',
          height: '100%',
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
          // border: '1px solid red',
          // position: 'relative',
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
        logoContainer: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-200%, -175%)', // căn giữa chính xác
          width: 400,
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // zIndex: -1,
        },

        logoImage: {
          borderRadius: '50%',
                    // zIndex: -1,

          opacity: 0.05, // Giảm độ trong suốt để tạo hiệu ứng mờ
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

function getDaysInMonth(month: number, year: number): (number | '')[] {
  const days: (number | '')[] = [];
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(day);
  }

  while (days.length < 31) {
    days.push(''); // thêm khoảng trống nếu thiếu
  }

  return days;
}

function getJapaneseWeekdays(month: number, year: number): (string | '')[] {
  const japaneseDays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekdays: (string | '')[] = [];
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    weekdays.push(japaneseDays[dayOfWeek]);
  }

  while (weekdays.length < 31) {
    weekdays.push('');
  }

  return weekdays;
}

export default function InternPDFAttendance({ item, intern, count, event }: any) {
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

  // const checkIsOff = async (int: any) => {
  //   const { data } = await axios.post(
  //     `${process.env.REACT_APP_HOST_API}/api/attendance/getInternByMonth`,
  //     {
  //       internId: int._id,
  //       month: item.month,
  //       year: item.year,
  //     }
  //   );
  // };
  const checkIsEvent = (month: any, year: any, day: any) => {
    for (const ev of event) {
      if (ev.month === month && ev.year === year) {
        return ev.days.find((ele: any) => ele === Number(day));
      }
    }
    return false;
  };

  return (
    <Document>
      <View style={styles.outerBorder}>
        {/* Logo chìm ở giữa trang */}

        <View style={[styles.gridContainer1, styles.mb10, styles.pImage]}>
          {/* <Image source="/assets/logo.png" style={{ width: 32, height: 32 }} /> */}

          {/* <View>
            <Text style={styles.subtitle3}>技能実習生事前教育評価表</Text>
        
          </View> */}
        </View>

        <View>
          <View>
            <View style={[styles.gridContainer]}>
              <View style={styles.table20}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1, height: '52px' }]}>
                    <View style={[styles.tableCell_13, styles.textCenter]}>
                      <Text>{count}ヶ月目</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow, { height: '26px' }]}>
                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      <Text>No.</Text>
                    </View>

                    <View style={[styles.tableCell_25, styles.titleBackground]}>
                      <Text>氏名</Text>
                    </View>

                    <View style={[styles.tableCell_4, styles.titleBackground]}>
                      {/* <Text></Text> */}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table70}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1, height: '26px' }]}>
                    <View style={[styles.tableCell_13, styles.titleBackground]}>
                      <Text>
                        {item.year}年{item.month}月
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow, { height: '26px' }]}>
                    {/* {Array.from({ length: 31 }, (_, index) => (
                      <View key={index} style={[styles.tableCell_26, styles.titleBackground]}>
                        <Text>{index + 1}</Text>
                      </View>
                    ))} */}
                    {getDaysInMonth(item.month, item.year).map((day, index) => {
                      // console.log("Index", index);
                      const weekday = getJapaneseWeekdays(item.month, item.year)[index]; // lấy thứ tương ứng
                      const isEvent = checkIsEvent(item.month, item.year, day);

                      return (
                        <View
                          key={index}
                          style={[
                            styles.tableCell_26,
                            isEvent
                              ? styles.titleBackgroundRed
                              : weekday === '土' || weekday === '日'
                              ? styles.titleBackgroundSS
                              : day === ''
                              ? styles.titleBackgroundRed
                              : styles.titleBackground,
                          ]}
                        >
                          <Text>{day}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={[styles.tableRow, { height: '26px' }]}>
                    {/* {Array.from({ length: 31 }, (_, index) => (
                      <View key={index} style={[styles.tableCell_26, styles.titleBackground]}>
                        <Text>{index + 1}</Text>
                      </View>
                    ))} */}
                    {getJapaneseWeekdays(item.month, item.year).map((day, index) => {
                      const isEvent = checkIsEvent(item.month, item.year, index + 1);

                      return (
                        <View
                          key={index}
                          style={[
                            styles.tableCell_26,
                            isEvent
                              ? styles.titleBackgroundRed
                              : day === '土' || day === '日'
                              ? styles.titleBackgroundSS
                              : day === ''
                              ? styles.titleBackgroundRed
                              : styles.titleBackground,
                          ]}
                        >
                          <Text>{day}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style={styles.table10}>
                <View>
                  <View style={[styles.tableRow, { borderTopWidth: 1, height: '78px' }]}>
                    <View style={[styles.tableCell_27, styles.textCenter, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>遅刻</Text>
                      <Text style={styles.subtitle2}>早退</Text>
                      <Text style={styles.subtitle2}>回数</Text>
                    </View>
                    <View style={[styles.tableCell_27, styles.textCenter, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>休み</Text>
                      <Text style={styles.subtitle2}>日数</Text>
                    </View>
                    <View style={[styles.tableCell_27, styles.textCenter, styles.titleBackground]}>
                      <Text style={styles.subtitle2}>出席</Text>
                      <Text style={styles.subtitle2}>日数</Text>
                      <Text style={styles.subtitle2}>
                        {intern[0].statistics[count - 1].totalSessions}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {intern.map((int: any, i: any) => (
            <InternPDFAttendanceItem
              int={int}
              i={i}
              month={item.month}
              year={item.year}
              checkEvent={checkIsEvent}
            />
          ))}
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logoImage} src="/assets/logo_new.png" />
        </View>
      </View>
    </Document>
  );
}
