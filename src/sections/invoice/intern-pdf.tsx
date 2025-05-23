import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// utils

import { IInternItem } from 'src/types/user';

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
        mb8: { marginBottom: 8 },
        mb10: { marginBottom: 10 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700, textAlign: 'center' },
        titleBackground: { backgroundColor: '#F6F0F0' },
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
          borderWidth: 0,
          borderBottomWidth: 0,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          marginBottom: 0,
          paddingBottom: 0,
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '8%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          padding: '3px 0',
        },
        tableCell_2: {
          padding: '3px 0',
          width: '50%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_3: {
          width: '15%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
        },
        tableCell_5: {
          width: '25%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
        },
        tableCell_4: {
          width: '10%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '3px 0',
        },
        tableCell_6: {
          padding: '3px 0',
          width: '30%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_7: {
          padding: '3px 0',
          width: '40%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_8: {
          padding: '3px 0',
          width: '20%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        textLeft: {
          textAlign: 'left',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  invoice: IInternItem;
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

export default function InternPDF({ invoice }: Props) {
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
  } = invoice;

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer1, styles.mb10]}>
          <Image source="/assets/logo.png" style={{ width: 32, height: 32 }} />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            {/* <Text style={styles.h3}>{currentStatus}</Text> */}
            <Text>NHAT TAN MANPOWER</Text>
            <Text>8 TX01, Thạnh Xuân, Quận 12, Hồ Chí Minh</Text>
          </View>
        </View>

        {/* <Text style={[styles.subtitle1, styles.mb8]}>技能実習生履歴書</Text> */}
        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>氏名</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text>{normalizeName(name)}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>性別</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{gender}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>身長(cm)</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{height}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>フリガナ</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text>{namejp}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>年齡(歳)</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{age}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>体重(Kg)</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{weight}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>生年月日</Text>
                </View>

                <View style={styles.tableCell_6}>
                  <Text>{changDateJP(birthday)}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>血液型</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{blood}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>配偶者</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{married}</Text>
                </View>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>BMI</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{BMI}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>視力</Text>
                </View>

                <View style={styles.tableCell_6}>
                  <Text>{`左目:${leftEye}/1.2、右目${rightEye}/1.2`}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>色弱</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{blindColor === true ? 'あり' : 'なし'}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>利き手</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{hand}</Text>
                </View>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>運転免許</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{driverLicense}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>現住所</Text>
                </View>

                <View style={styles.tableCell_6}>
                  <Text>{address}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>喫煙</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{smoke === true ? 'あり' : 'なし'}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>飲酒</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{alcohol === true ? 'あり' : 'なし'}</Text>
                </View>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>入れ墨</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{tattoo === true ? 'あり' : 'なし'}</Text>
                </View>
              </View>
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
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#DFE3E8',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              overflow: 'hidden',
            }}
          >
            <Image source={avatar} style={{ width: '100%', height: '100' }} />
          </View>
        </View>

        {/* <Text style={[styles.subtitle1, styles.mb8]}>学歴</Text> */}
        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table1}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_6, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>期間</Text>
                </View>

                <View style={[styles.tableCell_7, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>学校名</Text>
                </View>

                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>学習内容</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>現在</Text>
                </View>
              </View>
              {school.map((item: any, index: any) => (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell_6]}>
                    <Text>
                      {changMonthYearJP(item.timeFrom)} - {changMonthYearJP(item.timeTo)}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_7]}>
                    <Text>{item.name}</Text>
                  </View>

                  <View style={[styles.tableCell_8]}>
                    <Text>{item.content}</Text>
                  </View>

                  <View style={[styles.tableCell_4]}>
                    <Text>{item.current}</Text>
                  </View>
                </View>
              ))}
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

        {/* <Text style={[styles.subtitle1, styles.mb8]}>職歴</Text> */}
        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table1}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_6, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>期間</Text>
                </View>

                <View style={[styles.tableCell_7, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>会社(職場)</Text>
                </View>

                <View style={[styles.tableCell_6, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>仕事の内容</Text>
                </View>
              </View>
              {company.map((item: any, index: any) => (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell_6]}>
                    <Text>
                      {changMonthYearJP(item.timeFrom)} - {changMonthYearJP(item.timeTo)}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_7]}>
                    <Text>{item.name}</Text>
                  </View>

                  <View style={[styles.tableCell_6]}>
                    <Text>{item.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* <Text style={[styles.subtitle1, styles.mb8]}>家族構成</Text> */}
        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table1}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>関係</Text>
                </View>

                <View style={[styles.tableCell_7, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>氏名</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>生年</Text>
                </View>
                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>会社名(場所)</Text>
                </View>
                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>職業</Text>
                </View>
              </View>
              {family.map((item: any, index: any) => (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell_4]}>
                    <Text>{item.relationship}</Text>
                  </View>

                  <View style={[styles.tableCell_7]}>
                    <Text>{item.name}</Text>
                  </View>

                  <View style={[styles.tableCell_4]}>
                    <Text>{new Date(item.year).getFullYear()}</Text>
                  </View>
                  <View style={[styles.tableCell_8]}>
                    <Text>{item.location}</Text>
                  </View>
                  <View style={[styles.tableCell_8]}>
                    <Text>{item.occupation}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb10]}>
          <View style={styles.table1}>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_3, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>趣味</Text>
                </View>

                <View style={[styles.tableCell_6, styles.textLeft]}>
                  <Text>{interest}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>長所</Text>
                </View>
                <View style={[styles.tableCell_4, styles.textLeft]}>
                  <ul>
                    {strong.map((item: any) => (
                      <li key={item}>
                        <Text>•{item}</Text>
                      </li>
                    ))}
                  </ul>
                </View>
                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>短所</Text>
                </View>
                <View style={[styles.tableCell_3, styles.textLeft]}>
                  <ul>
                    {weak.map((item: any) => (
                      <li key={item}>
                        <Text>•{item}</Text>
                      </li>
                    ))}
                  </ul>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_3, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>日本に行くの目的・志望動機</Text>
                </View>

                <View style={[styles.tableCell_6, styles.textLeft]}>
                  <Text>{aim}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>外国語</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{foreignLanguage}</Text>
                </View>
                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>3年間後いくら貯金したいですか</Text>
                </View>
                <View style={[styles.tableCell_3]}>
                  <Text>{money}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_3, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>実習期間が終了した後、どんな予定がありますか</Text>
                </View>

                <View style={[styles.tableCell_6]}>
                  <Text>{plan}</Text>
                </View>

                <View style={[styles.tableCell_4, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>日本に親戚がいますか</Text>
                </View>
                <View style={[styles.tableCell_4]}>
                  <Text>{familyInJapan ? 'はい' : 'なし'}</Text>
                </View>
                <View style={[styles.tableCell_8, styles.titleBackground]}>
                  <Text style={styles.subtitle2}>外国へ行ったことがありますか</Text>
                </View>
                <View style={[styles.tableCell_3]}>
                  <Text>{moveForeign ? 'はい' : 'なし'}</Text>
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
      </Page>
    </Document>
  );
}
