/* eslint-disable no-nested-ternary */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axios from 'axios';

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        titleBackgroundYellow: {
          // backgroundColor: '#FADA7A',
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
                    backgroundColor: '#F67280',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleBackgroundGreen: {
          // backgroundColor: '#B6F500',
          backgroundColor: '#E0F9B5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },

        gridContainer: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          // padding: '5px'
        },

        table10: {
          display: 'flex',
          width: '10%',
        },
        table20: {
          display: 'flex',
          width: '20%',
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

        textCenter: {
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        },
      }),
    []
  );

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

export default function InternPDFAttendanceItem({ int, i, month, year, checkEvent }: any) {
  const styles = useStyles();
  console.log('INTERN', i, int);
  const checkOff = (day: any) => {
    const matchedAttendance = int.attendances.find(
      (attendance: any) => attendance.month === month && attendance.year === year
    );

    if (!matchedAttendance) return '';

    const matched = matchedAttendance.attend.find(
      (attend: any) => attend.off === true && new Date(attend.start).getDate() === day
    );

    if (!matched) return '';

    if (matched.allDay) return 'allDay';
    if (matched.am) return 'offam';
    if (matched.pm) return 'offpm';

    return '';
  };

  const statistics = int.statistics.find((item: any) => item.month === month && item.year === year);

  return (
    <View>
      <View style={[styles.gridContainer]}>
        <View style={styles.table18}>
          <View>
            <View style={[styles.tableRow, { height: '42.8px' }]}>
              <View style={[styles.tableCell_28, styles.textCenter]}>
                <Text>{i + 1}</Text>
              </View>

              <View style={[styles.tableCell_29, styles.textCenter]}>
                <Text>{int.name}</Text>
                <Text style={{fontSize: '8px'}}>{int.namejp}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.table2}>
          <View>
            <View style={[styles.tableRow]}>
              <View style={[styles.tableCell_13, styles.textCenter]}>
                <Text>AM</Text>
              </View>
            </View>
            <View style={[styles.tableRow]}>
              <View style={[styles.tableCell_13, styles.textCenter]}>
                <Text>PM</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.table70}>
          <View>
            <View style={[styles.tableRow]}>
              {getDaysInMonth(month, year).map((day, index) => {
                const weekday = getJapaneseWeekdays(month, year)[index]; // lấy thứ tương ứng
                const checkOffDay = checkOff(day);
                const isEvent = checkEvent(month, year, day);

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
                        : checkOffDay === 'allDay' || checkOffDay === 'offam'
                        ? styles.titleBackgroundGreen
                        : styles.titleBackgroundYellow,
                    ]}
                  >
                    <Text>
                      {day === '' || weekday === '土' || weekday === '日' || isEvent
                        ? ''
                        : checkOffDay === 'allDay' || checkOffDay === 'offam'
                        ? '×'
                        : '○'}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={[styles.tableRow]}>
              {getDaysInMonth(month, year).map((day, index) => {
                const weekday = getJapaneseWeekdays(month, year)[index]; // lấy thứ tương ứng
                const checkOffDay = checkOff(day);
                const isEvent = checkEvent(month, year, index + 1);

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
                        : checkOffDay === 'allDay' || checkOffDay === 'offpm'
                        ? styles.titleBackgroundGreen
                        : styles.titleBackgroundYellow,
                    ]}
                  >
                    <Text>
                      {day === '' || weekday === '土' || weekday === '日' || isEvent
                        ? ''
                        : checkOffDay === 'allDay' || checkOffDay === 'offpm'
                        ? '×'
                        : '○'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.table10}>
          <View>
            <View style={[styles.tableRow, { borderTopWidth: 1, height: '42.8px' }]}>
              <View style={[styles.tableCell_27, styles.textCenter]}>
                <Text>0</Text>
              </View>
              <View style={[styles.tableCell_27, styles.textCenter]}>
                <Text>{statistics.manualOffSessions}</Text>
              </View>
              <View style={[styles.tableCell_27, styles.textCenter]}>
                <Text>{statistics.attendedDays}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
