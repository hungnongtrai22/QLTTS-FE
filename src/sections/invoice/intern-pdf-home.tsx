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
        subtitle2: { fontSize: 6, fontWeight: 700, textAlign: 'center' },
        subtitle3: { fontSize: 6, textAlign: 'center' },
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
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 6,
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
          padding: '1px 0',
        },
        tableCell_2: {
          padding: '1px 0',
          width: '50%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_3: {
          width: '12.5%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '1px 0',
        },
        tableCell_5: {
          width: '23%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '1px 0',
        },
        tableCell_4: {
          width: '10%',
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
          height: '100%',
          padding: '1px 0',
        },
        tableCell_6: {
          padding: '1px 0',
          width: '30%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_7: {
          padding: '1px 0',
          width: '40%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_8: {
          padding: '1px 0',
          width: '20%',
          height: '100%',
          // paddingRight: 16,
          textAlign: 'center',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_9: {
          padding: '1px 0',
          width: '7%',
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
  invoice: any;
  startIndex: number;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function InternPDFHome({ invoice, startIndex = 0 }: Props) {
  // const { name } = invoice;
  console.log("Interns", invoice);

  const styles = useStyles();

  return (
    <Document>
      <View style={[styles.gridContainer1, styles.mb10]}>
        <Image source="/assets/logo.png" style={{ width: 32, height: 32 }} />

        <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
          {/* <Text style={styles.h3}>{currentStatus}</Text> */}
          <Text>NHAT TAN MANPOWER</Text>
          <Text style={styles.subtitle4}>8 TX01, Thanh Xuan Ward, District 12, Ho Chi Minh City, Vietnam</Text>
        </View>
      </View>

      {/* <Text style={[styles.subtitle1, styles.mb8]}>技能実習生履歴書</Text> */}

      {/* <Text style={[styles.subtitle1, styles.mb8]}>学歴</Text> */}
      <View style={[styles.gridContainer]}>
        <View style={styles.table1}>
          <View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>順番</Text>
              </View>

              <View style={[styles.tableCell_5, styles.titleBackground]}>
                <Text style={styles.subtitle2}>氏名</Text>
              </View>

              <View style={[styles.tableCell_4, styles.titleBackground]}>
                <Text style={styles.subtitle2}>出身</Text>
              </View>

              <View style={[styles.tableCell_3, styles.titleBackground]}>
                <Text style={styles.subtitle2}>生年月日</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>年齢</Text>
                <Text>(歳)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>身長</Text>
                <Text>(Cm)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>体重</Text>
                <Text>(Kg)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>IQ</Text>
                <Text>テスト</Text>
                <Text>(50点)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>数学</Text>
                <Text>テスト</Text>
                <Text>(100点)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>クレペ</Text>
                <Text>リン(2回、</Text>
                <Text>400点/回)</Text>
              </View>
              <View style={[styles.tableCell_3, styles.titleBackground]}>
                <Text style={styles.subtitle2}>写真</Text>
              </View>
            </View>
           {invoice.map((intern: any, index : any) => <View style={styles.tableRow}>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{startIndex + index + 1}</Text>
              </View>

              <View style={[styles.tableCell_5, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern.name}</Text>
                <Text style={styles.subtitle3}>{intern.namejp}</Text>
              </View>

              <View style={[styles.tableCell_4, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern.city}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{changDateJP(intern.birthday)}</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern.age}</Text>
                <Text style={styles.subtitle3}>(歳)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern.height}</Text>
                <Text style={styles.subtitle3}>(Cm)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern.weight}</Text>
                <Text style={styles.subtitle3}>(Kg)</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern?.iq || ""}</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern?.math || ""}</Text>
              </View>
              <View style={[styles.tableCell_9, styles.titleNoBackground]}>
                <Text style={styles.subtitle3}>{intern?.kraepelin1 || ""}</Text>
                <Text style={styles.subtitle3}>{intern?.kraepelin2 || ""}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.titleNoBackground]}>
                <Image
                  src={intern.avatar}
                  style={{
                    width: '100%',
                    height: '50px',
                    objectFit: 'contain',
                  }}
                />
              </View>
            </View>)}
            {/* <View style={styles.tableRow}>
              <View style={[styles.tableCell_9, styles.titleBackground]}>
                <Text style={styles.subtitle2}>1</Text>
              </View>

              <View style={styles.tableCell_5}>
                <Text style={styles.subtitle2}>NGUYEN THI NHU</Text>
                <Text>グエン・ティー・ヌー</Text>
              </View>

              <View style={styles.tableCell_4}>
                <Text>TIEN GIANG省</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>2000年2月6日</Text>
              </View>

              <View style={[styles.tableCell_9]}>
                <Text>25</Text>
              </View>

              <View style={[styles.tableCell_9]}>
                <Text>162</Text>
              </View>

              <View style={[styles.tableCell_9]}>
                <Text>65</Text>
              </View>
              <View style={[styles.tableCell_9]}>
                <Text>43</Text>
              </View>
              <View style={[styles.tableCell_9]}>
                <Text>90</Text>
              </View>
              <View style={[styles.tableCell_3]}>
                <Text>400</Text>
                <Text>360</Text>
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
      </View>
    </Document>
  );
}
