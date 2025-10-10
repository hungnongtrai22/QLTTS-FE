/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify';
import dayjs from 'dayjs';

export type Intern = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  web: string;
  tradeUnion: any;
};

type Props = {
  interns: Intern[];
  name: any;
};

const changDateJP = (date: any): string => {
  // Nếu date là null, undefined, chuỗi rỗng, v.v. thì trả về "" ngay.
  if (!date) {
    return '';
  }

  const jsDate = new Date(date);

  // Kiểm tra xem đối tượng Date có hợp lệ không.
  // Nếu không hợp lệ, jsDate.getTime() sẽ trả về NaN.
  if (Number.isNaN(jsDate.getTime())) {
    return ''; // Trả về chuỗi rỗng nếu không hợp lệ
  }

  // Nếu hợp lệ, tiến hành định dạng
  const year = jsDate.getFullYear();
  const month = jsDate.getMonth() + 1; // getMonth() bắt đầu từ 0 (tháng 1 là 0)
  const day = jsDate.getDate();

  return `${year}年${month}月${day}日`;
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

const ExportListCompany: React.FC<Props> = ({ interns, name }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fetchImageBuffer = async (url: string): Promise<ExcelJS.Buffer | undefined> => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const arrayBuffer = response.data as ArrayBuffer;
      return new Uint8Array(arrayBuffer) as unknown as ExcelJS.Buffer;
    } catch {
      console.warn('Không thể tải ảnh:', url);
      return undefined;
    }
  };

  const handleExport = async () => {
    try {
      // Giữ tối đa 30 intern
      setIsLoading(true);
      const list = interns;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Interns');

      // Tiêu đề chung
      sheet.mergeCells('A1:H1');
      const title = sheet.getCell('A1');
      title.value = 'Danh Sách Công Ty';
      title.alignment = { horizontal: 'center', vertical: 'middle' };
      title.font = { bold: true, size: 16 };

      // Header
      const headers = [
        'STT',
        'Tên',
        'Email',
        'Web',
        'Địa Chỉ',
        'Thành Phố',
        'Tỉnh',
        'Số Điện Thoại',
        'Nghiệp Đoàn',
      ];
      sheet.addRow(headers);
      const headerRow = sheet.getRow(2);
      headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.font = { bold: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      headerRow.height = 45;
      // set đủ rộng cho cột ảnh
      sheet.getColumn(12).width = 16;

      let currentRow = 3;
      for (let i = 0; i < list.length; i++) {
        const it = list[i];

        // merge cột
        // sheet.mergeCells(`A${currentRow}:A${currentRow + 3}`);
        // sheet.mergeCells(`B${currentRow}:B${currentRow + 1}`);
        // sheet.mergeCells(`B${currentRow + 2}:B${currentRow + 3}`);
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((col) =>
          sheet.mergeCells(`${col}${currentRow}:${col}${currentRow + 3}`)
        );
        // sheet.mergeCells(`J${currentRow}:J${currentRow + 1}`);
        // sheet.mergeCells(`J${currentRow + 2}:J${currentRow + 3}`);
        // sheet.mergeCells(`L${currentRow}:L${currentRow + 3}`);

        // gán dữ liệu
        sheet.getCell(`A${currentRow}`).value = i + 1;
        sheet.getCell(`B${currentRow}`).value = it.name;
        // sheet.getCell(`B${currentRow + 2}`).value = it?.email;
        sheet.getCell(`C${currentRow}`).value = it?.email;
        sheet.getCell(`D${currentRow}`).value = it?.web;
        sheet.getCell(`E${currentRow}`).value = it?.address;
        sheet.getCell(`F${currentRow}`).value = it?.city;
        sheet.getCell(`G${currentRow}`).value = it?.state;
        sheet.getCell(`H${currentRow}`).value = it?.phone;
        sheet.getCell(`I${currentRow}`).value = it?.tradeUnion;
        // sheet.getCell(`H${currentRow}`).value = it?.companySelect?.name;
        // sheet.getCell(`I${currentRow}`).value = it?.job;
        // sheet.getCell(`J${currentRow}`).value = it?.companySelect?.address;
        // sheet.getCell(`K${currentRow}`).value = it?.companySelect?.state;
        // sheet.getCell(`J${currentRow + 2}`).value =
        //   it.kraepelin2 === 0 || it.kraepelin2 == null ? '' : it.kraepelin2;

        // căn giữa & border
        for (let r = currentRow; r < currentRow + 4; r++) {
          const row = sheet.getRow(r);
          row.height = 20;
          row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }

        // chèn ảnh căn giữa
        // const buf = await fetchImageBuffer(it.avatar);
        // if (buf) {
        //   const imgId = workbook.addImage({ buffer: buf, extension: 'jpeg' });
        //   // tính offset đơn giản lệch phải 0.2, xuống 0.2
        //   sheet.addImage(imgId, {
        //     tl: { col: 11 + 0.95, row: currentRow - 1 + 0.33 },
        //     ext: { width: 70, height: 70 },
        //     editAs: 'oneCell',
        //   });
        // }

        currentRow += 4;
      }

      // auto width (ngoại trừ cột ảnh)
      // Auto width (ngoại trừ cột ảnh)
      sheet.columns.forEach((col, idx) => {
        if (idx !== 11) {
          let ml = 11;
          // Kiểm tra trước khi gọi eachCell
          if (typeof col.eachCell === 'function') {
            col.eachCell((cell) => {
              const l = String(cell.value ?? '').length + 5;
              if (l > ml) ml = l;
            });
          }
          col.width = ml;
        }
      });

      // for (let i = 0; i < list.length; i++) {
      //   const it = list[i];
      //   const sheetIntern = workbook.addWorksheet(`${i + 1}. ${normalizeName(it.name)}`);
      //   const numberSchool = it.school.length;
      //   const numberCompany = it.company.length;
      //   const numberFamily = it.family.length;

      //   // Tiêu đề chung
      //   sheetIntern.mergeCells('A1:I4'); // Gộp toàn bộ khối A1 đến I4 thành 1 ô duy nhất
      //   const titleIntern = sheetIntern.getCell('A1');
      //   titleIntern.value =
      //     'NHAT TAN MANPOWER\nAddress: No. 8, TX01 Street, Thanh Xuan Ward, District 12, Ho Chi Minh City, Viet Nam';
      //   titleIntern.alignment = {
      //     horizontal: 'center',
      //     vertical: 'middle',
      //     wrapText: true, // Cho phép xuống dòng
      //   };
      //   titleIntern.font = {
      //     name: 'Arial', // Đặt font chữ
      //     size: 11, // Cỡ chữ
      //     bold: true, // In đậm
      //     color: { argb: 'FFFF0000' }, // Mã màu đỏ (ARGB)
      //   };
      //   titleIntern.border = {
      //     top: { style: 'thin' },
      //     left: { style: 'thin' },
      //     bottom: { style: 'thin' },
      //     right: { style: 'thin' },
      //   };

      //   const headerIntern = [
      //     '技能実習生履歴書',
      //     `履歴書日 ${changDateJP(new Date().toISOString())}`,
      //     `面接番号: ${i + 1}`,
      //   ];

      //   // Gộp ô cho tiêu đề thành 3 khối ngang
      //   sheetIntern.mergeCells('A5:C5');
      //   sheetIntern.mergeCells('D5:G5');
      //   sheetIntern.mergeCells('H5:I5');

      //   // Gán giá trị trực tiếp vào các ô đã gộp
      //   sheetIntern.getCell('A5').value = headerIntern[0];
      //   sheetIntern.getCell('D5').value = headerIntern[1];
      //   sheetIntern.getCell('H5').value = headerIntern[2];

      //   // Thiết lập style cho từng ô đã gộp
      //   [
      //     'A5',
      //     'D5',
      //     'H5',
      //     'B13',
      //     'D13',
      //     'G13',
      //     'I13',
      //     `B${13 + numberSchool + 2}`,
      //     `D${13 + numberSchool + 2}`,
      //     `G${13 + numberSchool + 2}`,
      //     `B${13 + numberSchool + numberCompany + 4}`,
      //     `C${13 + numberSchool + numberCompany + 4}`,
      //     `E${13 + numberSchool + numberCompany + 4}`,
      //     `F${13 + numberSchool + numberCompany + 4}`,
      //     `H${13 + numberSchool + numberCompany + 4}`,
      //   ].forEach((cellRef) => {
      //     const cell = sheetIntern.getCell(cellRef);
      //     cell.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 15,
      //       // bold: true,
      //     };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: 'FFFCE4D6' }, // Màu nền cam nhạt
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });

      //   // Tăng chiều cao hàng 5 để hiển thị đẹp
      //   sheetIntern.getRow(5).height = 40;
      //   sheetIntern.getRow(13).height = 40;
      //   sheetIntern.getRow(13 + numberSchool + 2).height = 40;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + 4).height = 40;

      //   sheetIntern.getCell('A6').value = '氏名';
      //   sheetIntern.getCell('D6').value = '性別';
      //   sheetIntern.getCell('F6').value = '年齢(歳)';
      //   sheetIntern.getCell('A7').value = 'フリガナ';
      //   sheetIntern.getCell('D7').value = '身長(cm)';
      //   sheetIntern.getCell('F7').value = '体重(Kg)';
      //   sheetIntern.getCell('A8').value = '生年月日';
      //   sheetIntern.getCell('D8').value = '血液型';
      //   sheetIntern.getCell('F8').value = 'BMI';
      //   sheetIntern.getCell('A9').value = '視力';
      //   sheetIntern.getCell('D9').value = '色弱';
      //   sheetIntern.getCell('F9').value = '利き手';
      //   sheetIntern.getCell('A10').value = '現住所';
      //   sheetIntern.getCell('D10').value = '配偶者';
      //   sheetIntern.getCell('F10').value = '運転免許（車）';
      //   sheetIntern.getCell('A11').value = '喫煙';
      //   sheetIntern.getCell('D11').value = '飲酒';
      //   sheetIntern.getCell('F11').value = '入れ墨';
      //   sheetIntern.getCell('A13').value = '学\n歴';
      //   sheetIntern.getCell('B13').value = '期間';
      //   sheetIntern.getCell('D13').value = '学校名';
      //   sheetIntern.getCell('G13').value = '学習内容';
      //   sheetIntern.getCell('I13').value = '現在';
      //   sheetIntern.getCell('I13').value = '現在';
      //   sheetIntern.getCell(`A${13 + numberSchool + 2}`).value = '職\n歴';
      //   sheetIntern.getCell(`B${13 + numberSchool + 2}`).value = '期間';
      //   sheetIntern.getCell(`D${13 + numberSchool + 2}`).value = '会社（職場）';
      //   sheetIntern.getCell(`G${13 + numberSchool + 2}`).value = '仕事の内容';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + 4}`).value = '家\n族\n構\n成';
      //   sheetIntern.getCell(`B${13 + numberSchool + numberCompany + 4}`).value = '関係';
      //   sheetIntern.getCell(`C${13 + numberSchool + numberCompany + 4}`).value = '氏名';
      //   sheetIntern.getCell(`E${13 + numberSchool + numberCompany + 4}`).value = '生年';
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + 4}`).value = '会社名';
      //   sheetIntern.getCell(`H${13 + numberSchool + numberCompany + 4}`).value = '職業';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 6}`).value =
      //     '趣味';
      //   sheetIntern.getCell(`E${13 + numberSchool + numberCompany + numberFamily + 6}`).value =
      //     '長所';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 7}`).value =
      //     '外国語';
      //   sheetIntern.getCell(`E${13 + numberSchool + numberCompany + numberFamily + 7}`).value =
      //     '短所';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 8}`).value =
      //     '日本に行くの目的・志望・動機';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 9}`).value =
      //     '３年間後いくら貯金したいですか';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 10}`).value =
      //     '実習期間が終了した後、どんな予定がありますか';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 11}`).value =
      //     '日本に親戚がいますか';
      //   sheetIntern.getCell(`A${13 + numberSchool + numberCompany + numberFamily + 12}`).value =
      //     '外国へ行ったことがありますか';

      //   sheetIntern.getRow(6).height = 35;
      //   sheetIntern.getRow(7).height = 35;
      //   sheetIntern.getRow(8).height = 35;
      //   sheetIntern.getRow(9).height = 35;
      //   sheetIntern.getRow(10).height = 35;
      //   sheetIntern.getRow(11).height = 35;
      //   sheetIntern.getRow(12).height = 7;
      //   sheetIntern.getRow(13).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + 1).height = 7;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + 3).height = 7;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 5).height = 7;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 6).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 7).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 8).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 9).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 10).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 11).height = 35;
      //   sheetIntern.getRow(13 + numberSchool + numberCompany + numberFamily + 12).height = 35;

      //   for (let j = 1; j <= numberSchool; j++) {
      //     sheetIntern.getRow(13 + j).height = 35;
      //     sheetIntern.mergeCells(`B${13 + j}:C${13 + j}`);
      //     sheetIntern.mergeCells(`D${13 + j}:F${13 + j}`);
      //     sheetIntern.mergeCells(`G${13 + j}:H${13 + j}`);
      //     // sheetIntern.getCell(`B${13 + j}`).value = ``;
      //     const item = it.school[j - 1];
      //     const timeTo = changMonthYearJP(item.timeFrom);
      //     const timeFrom =
      //       dayjs(item.timeTo).isSame(dayjs(), 'month') &&
      //       dayjs(item.timeTo).isSame(dayjs(), 'year')
      //         ? '現在'
      //         : changMonthYearJP(item.timeTo);
      //     sheetIntern.getCell(`B${13 + j}`).value = `${timeTo} - ${timeFrom}`;
      //     sheetIntern.getCell(`D${13 + j}`).value = item.name;
      //     sheetIntern.getCell(`G${13 + j}`).value = item.content;
      //     sheetIntern.getCell(`I${13 + j}`).value = item.current;

      //     const cell = sheetIntern.getCell(`B${13 + j}`);
      //     cell.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellD = sheetIntern.getCell(`D${13 + j}`);
      //     cellD.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellD.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellD.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellG = sheetIntern.getCell(`G${13 + j}`);
      //     cellG.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellG.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellG.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellI = sheetIntern.getCell(`I${13 + j}`);
      //     cellI.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellI.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellI.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   }

      //   for (let j = 1; j <= numberCompany; j++) {
      //     sheetIntern.getRow(13 + numberSchool + 2 + j).height = 35;
      //     sheetIntern.mergeCells(`B${13 + numberSchool + 2 + j}:C${13 + numberSchool + 2 + j}`);
      //     sheetIntern.mergeCells(`D${13 + numberSchool + 2 + j}:F${13 + numberSchool + 2 + j}`);
      //     sheetIntern.mergeCells(`G${13 + numberSchool + 2 + j}:I${13 + numberSchool + 2 + j}`);
      //     // sheetIntern.getCell(`B${13 + j}`).value = ``;
      //     const item = it.company[j - 1];
      //     const timeTo = changMonthYearJP(item.timeFrom);
      //     const timeFrom =
      //       dayjs(item.timeTo).isSame(dayjs(), 'month') &&
      //       dayjs(item.timeTo).isSame(dayjs(), 'year')
      //         ? '現在'
      //         : changMonthYearJP(item.timeTo);
      //     sheetIntern.getCell(`B${13 + numberSchool + 2 + j}`).value = `${timeTo} - ${timeFrom}`;
      //     sheetIntern.getCell(`D${13 + numberSchool + 2 + j}`).value = item.name;
      //     sheetIntern.getCell(`G${13 + numberSchool + 2 + j}`).value = item.content;

      //     const cell = sheetIntern.getCell(`B${13 + numberSchool + 2 + j}`);
      //     cell.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellD = sheetIntern.getCell(`D${13 + numberSchool + 2 + j}`);
      //     cellD.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellD.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellD.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellG = sheetIntern.getCell(`G${13 + numberSchool + 2 + j}`);
      //     cellG.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellG.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellG.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   }
      //   for (let j = 1; j <= numberFamily; j++) {
      //     sheetIntern.getRow(13 + numberSchool + numberCompany + 4 + j).height = 35;
      //     sheetIntern.mergeCells(
      //       `C${13 + numberSchool + numberCompany + 4 + j}:D${
      //         13 + numberSchool + numberCompany + 4 + j
      //       }`
      //     );
      //     sheetIntern.mergeCells(
      //       `F${13 + numberSchool + numberCompany + 4 + j}:G${
      //         13 + numberSchool + numberCompany + 4 + j
      //       }`
      //     );
      //     sheetIntern.mergeCells(
      //       `H${13 + numberSchool + numberCompany + 4 + j}:I${
      //         13 + numberSchool + numberCompany + 4 + j
      //       }`
      //     );
      //     // sheetIntern.getCell(`B${13 + j}`).value = ``;
      //     const item = it.family[j - 1];
      //     sheetIntern.getCell(`B${13 + numberSchool + numberCompany + 4 + j}`).value =
      //       item.relationship;
      //     sheetIntern.getCell(`C${13 + numberSchool + numberCompany + 4 + j}`).value = item.name;
      //     sheetIntern.getCell(`E${13 + numberSchool + numberCompany + 4 + j}`).value = item.year
      //       ? new Date(item.year).getFullYear()
      //       : '死亡';
      //     sheetIntern.getCell(`F${13 + numberSchool + numberCompany + 4 + j}`).value =
      //       item?.location || '';
      //     sheetIntern.getCell(`H${13 + numberSchool + numberCompany + 4 + j}`).value =
      //       item?.occupation || '';
      //     const cell = sheetIntern.getCell(`B${13 + numberSchool + numberCompany + 4 + j}`);
      //     cell.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellC = sheetIntern.getCell(`C${13 + numberSchool + numberCompany + 4 + j}`);
      //     cellC.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellC.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellC.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellE = sheetIntern.getCell(`E${13 + numberSchool + numberCompany + 4 + j}`);
      //     cellE.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellE.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellE.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellF = sheetIntern.getCell(`F${13 + numberSchool + numberCompany + 4 + j}`);
      //     cellF.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellF.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellF.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //     const cellH = sheetIntern.getCell(`H${13 + numberSchool + numberCompany + 4 + j}`);
      //     cellH.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cellH.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     cellH.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   }

      //   [
      //     'A6',
      //     'D6',
      //     'F6',
      //     'A7',
      //     'D7',
      //     'F7',
      //     'A8',
      //     'D8',
      //     'F8',
      //     'A9',
      //     'D9',
      //     'F9',
      //     'A10',
      //     'D10',
      //     'F10',
      //     'A11',
      //     'D11',
      //     'F11',
      //     'A13',
      //     `A${13 + numberSchool + 2}`,
      //     `A${13 + numberSchool + numberCompany + 4}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 6}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 6}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 7}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 7}`,
      //   ].forEach((cellRef) => {
      //     const cell = sheetIntern.getCell(cellRef);
      //     cell.alignment = {
      //       horizontal: 'center',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 10,
      //       // bold: true,
      //     };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: 'FFDDEBF7' }, // Màu nền cam nhạt
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });
      //   [
      //     `A${13 + numberSchool + numberCompany + numberFamily + 8}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 9}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 10}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 11}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 12}`,
      //   ].forEach((cellRef) => {
      //     const cell = sheetIntern.getCell(cellRef);
      //     cell.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 10,
      //       // bold: true,
      //     };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: 'FFDDEBF7' }, // Màu nền cam nhạt
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });
      //   [
      //     'B6',
      //     'B7',
      //     'B8',
      //     'B9',
      //     'B10',
      //     'B11',
      //     'A12',
      //     `A${13 + numberSchool + 1}`,
      //     `A${13 + numberSchool + numberCompany + 3}`,
      //     `A${13 + numberSchool + numberCompany + numberFamily + 5}`,
      //     `B${13 + numberSchool + numberCompany + numberFamily + 6}`,
      //     `F${13 + numberSchool + numberCompany + numberFamily + 6}`,
      //     `B${13 + numberSchool + numberCompany + numberFamily + 7}`,
      //     `F${13 + numberSchool + numberCompany + numberFamily + 7}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 8}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 9}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 10}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 11}`,
      //     `E${13 + numberSchool + numberCompany + numberFamily + 12}`,
      //   ].forEach((cellRef) => {
      //     const cell = sheetIntern.getCell(cellRef);
      //     cell.alignment = {
      //       horizontal: 'left',
      //       vertical: 'middle',
      //       wrapText: true,
      //     };
      //     cell.font = {
      //       name: 'UD デジタル 教科書体 N-R',
      //       size: 11,
      //       // bold: true,
      //     };
      //     // cell.fill = {
      //     //   type: 'pattern',
      //     //   pattern: 'solid',
      //     //   fgColor: { argb: 'FFDDEBF7' }, // Màu nền cam nhạt
      //     // };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });
      //   ['E6', 'G6', 'H6', 'E7', 'G7', 'E8', 'G8', 'E9', 'G9', 'E10', 'G10', 'E11', 'G11'].forEach(
      //     (cellRef) => {
      //       const cell = sheetIntern.getCell(cellRef);
      //       cell.alignment = {
      //         horizontal: 'center',
      //         vertical: 'middle',
      //         wrapText: true,
      //       };
      //       cell.font = {
      //         name: 'UD デジタル 教科書体 N-R',
      //         size: 11,
      //         // bold: true,
      //       };

      //       cell.border = {
      //         top: { style: 'thin' },
      //         left: { style: 'thin' },
      //         bottom: { style: 'thin' },
      //         right: { style: 'thin' },
      //       };
      //     }
      //   );
      //   sheetIntern.mergeCells('B6:C6');
      //   sheetIntern.mergeCells('B7:C7');
      //   sheetIntern.mergeCells('B8:C8');
      //   sheetIntern.mergeCells('B9:C9');
      //   sheetIntern.mergeCells('B10:C10');
      //   sheetIntern.mergeCells('B11:C11');
      //   sheetIntern.mergeCells('A12:I12');
      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + 3}:I${13 + numberSchool + numberCompany + 3}`
      //   );
      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 5}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 5
      //     }`
      //   );
      //   sheetIntern.mergeCells(`A${13 + numberSchool + 1}:I${13 + numberSchool + 1}`);
      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + 2}:A${13 + numberSchool + 2 + numberCompany}`
      //   );
      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + 4}:A${
      //       13 + numberSchool + 4 + numberCompany + numberFamily
      //     }`
      //   );
      //   sheetIntern.mergeCells(`A13:A${13 + numberSchool}`);
      //   sheetIntern.mergeCells('B13:C13');
      //   sheetIntern.mergeCells('D13:F13');
      //   sheetIntern.mergeCells(`B${13 + numberSchool + 2}:C${13 + numberSchool + 2}`);
      //   sheetIntern.mergeCells(`D${13 + numberSchool + 2}:F${13 + numberSchool + 2}`);
      //   sheetIntern.mergeCells(`G${13 + numberSchool + 2}:I${13 + numberSchool + 2}`);
      //   sheetIntern.mergeCells(
      //     `C${13 + numberSchool + numberCompany + 4}:D${13 + numberSchool + numberCompany + 4}`
      //   );
      //   sheetIntern.mergeCells(
      //     `F${13 + numberSchool + numberCompany + 4}:G${13 + numberSchool + numberCompany + 4}`
      //   );
      //   sheetIntern.mergeCells(
      //     `H${13 + numberSchool + numberCompany + 4}:I${13 + numberSchool + numberCompany + 4}`
      //   );
      //   sheetIntern.mergeCells(
      //     `B${13 + numberSchool + numberCompany + numberFamily + 6}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 6
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `F${13 + numberSchool + numberCompany + numberFamily + 6}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 6
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `B${13 + numberSchool + numberCompany + numberFamily + 7}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 7
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `F${13 + numberSchool + numberCompany + numberFamily + 7}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 7
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 8}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 8
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `E${13 + numberSchool + numberCompany + numberFamily + 8}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 8
      //     }`
      //   );

      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 9}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 9
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `E${13 + numberSchool + numberCompany + numberFamily + 9}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 9
      //     }`
      //   );

      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 10}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 10
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `E${13 + numberSchool + numberCompany + numberFamily + 10}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 10
      //     }`
      //   );

      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 11}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 11
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `E${13 + numberSchool + numberCompany + numberFamily + 11}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 11
      //     }`
      //   );

      //   sheetIntern.mergeCells(
      //     `A${13 + numberSchool + numberCompany + numberFamily + 12}:D${
      //       13 + numberSchool + numberCompany + numberFamily + 12
      //     }`
      //   );
      //   sheetIntern.mergeCells(
      //     `E${13 + numberSchool + numberCompany + numberFamily + 12}:I${
      //       13 + numberSchool + numberCompany + numberFamily + 12
      //     }`
      //   );
      //   sheetIntern.mergeCells('G13:H13');

      //   // sheetIntern.mergeCells(`A13:A16`);

      //   sheetIntern.getCell('B6').value = normalizeName(it.name);
      //   sheetIntern.getCell('E6').value = it.gender;
      //   sheetIntern.getCell('G6').value = it.age;
      //   sheetIntern.getCell('B7').value = it.namejp;
      //   sheetIntern.getCell('E7').value = it.height;
      //   sheetIntern.getCell('G7').value = it.height;
      //   sheetIntern.getCell('B8').value = changDateJP(it.birthday);
      //   sheetIntern.getCell('E8').value = it.blood;
      //   sheetIntern.getCell('G8').value = it.BMI;
      //   sheetIntern.getCell('B9').value = `左目: ${it.leftEye} - 右目: ${it.rightEye}`;
      //   sheetIntern.getCell('E9').value = it.blindColor === true ? 'あり' : 'なし';
      //   sheetIntern.getCell('G9').value = it.hand;
      //   sheetIntern.getCell('B10').value = it.address;
      //   sheetIntern.getCell('E10').value = it.married;
      //   sheetIntern.getCell('G10').value = it.driverLicense;
      //   sheetIntern.getCell('B11').value = it.smoke === true ? 'あり' : 'なし';
      //   sheetIntern.getCell('E11').value = it.alcohol === true ? 'あり' : 'なし';
      //   sheetIntern.getCell('G11').value = it.tattoo === true ? 'あり' : 'なし';
      //   sheetIntern.getCell(`B${13 + numberSchool + numberCompany + numberFamily + 6}`).value =
      //     it.interest;
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 6}`).value =
      //     it.strong.join(', ');
      //   sheetIntern.getCell(`B${13 + numberSchool + numberCompany + numberFamily + 7}`).value =
      //     it.foreignLanguage;
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 7}`).value =
      //     it.weak.join(', ');
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 8}`).value =
      //     it.aim;
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 9}`).value =
      //     it.money;
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 10}`).value =
      //     it.plan;
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 11}`).value =
      //     it.familyInJapan === true ? 'あり' : 'なし';
      //   sheetIntern.getCell(`F${13 + numberSchool + numberCompany + numberFamily + 12}`).value =
      //     it.moveForeign === true ? 'あり' : 'なし';

      //   sheetIntern.getColumn('C').width = 30;
      //   sheetIntern.getColumn('I').width = 13;

      //   sheetIntern.mergeCells('H6:I11');

      //   // Chèn ảnh vào vùng H6:I11 và căn giữa, full cell
      //   const bufAvatar = await fetchImageBuffer(it.avatar);
      //   if (bufAvatar) {
      //     const imageId = workbook.addImage({
      //       buffer: bufAvatar,
      //       extension: 'jpeg', // hoặc 'png' nếu ảnh PNG
      //     });

      //     // Vị trí bắt đầu và kết thúc của vùng merge
      //     const colStart = 7; // Cột H
      //     const colEnd = 8; // Cột I
      //     const rowStart = 6;
      //     const rowEnd = 11;

      //     // Tính tổng chiều rộng (đơn vị pixels) của cột H và I
      //     const colWidthH = sheetIntern.getColumn(colStart).width ?? 10;
      //     const colWidthI = sheetIntern.getColumn(colEnd).width ?? 10;
      //     const totalWidth = (colWidthH + colWidthI) * 7.5; // xấp xỉ 7.5 pixels per unit

      //     // Tính tổng chiều cao các hàng 6 đến 11
      //     let totalHeight = 0;
      //     for (let r = rowStart; r <= rowEnd; r++) {
      //       totalHeight += sheetIntern.getRow(r).height ?? 15; // default height nếu chưa đặt
      //     }

      //     // Căn giữa ảnh trong vùng merge và chèn vào sheet
      //     sheetIntern.addImage(imageId, {
      //       tl: {
      //         col: colStart + 0.05, // Lệch phải một chút để không đè viền
      //         row: rowStart - 1 + 0.05,
      //       },
      //       ext: {
      //         width: totalWidth,
      //         height: totalHeight,
      //       },
      //       editAs: 'oneCell',
      //     });
      //   }
      // }

      const buf = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buf], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        `${name}.xlsx`
      );
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert('Xuất Excel thất bại');
    }
  };

  return (
    <MenuItem onClick={handleExport}>
      <Iconify icon="file-icons:microsoft-excel" />
      {isLoading ? 'Đang xuất ...' : 'Xuất Excel'}
    </MenuItem>
  );
};

export default ExportListCompany;
