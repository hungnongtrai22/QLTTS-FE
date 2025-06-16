/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify';

export type Intern = {
  name: string;
  namejp: string;
  city: string;
  birthday: string;
  age: number;
  height: number;
  weight: number;
  iq?: number;
  math?: number;
  kraepelin1?: number;
  kraepelin2?: number;
  avatar: string;
};

type Props = {
  interns: Intern[];
  name: any;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

const ExportInternsWithAvatar: React.FC<Props> = ({ interns, name }) => {
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
      const list = interns;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Interns');

      // Tiêu đề chung
      sheet.mergeCells('A1:K1');
      const title = sheet.getCell('A1');
      title.value = '技能実習生候補者一覧表';
      title.alignment = { horizontal: 'center', vertical: 'middle' };
      title.font = { bold: true, size: 16 };

      // Header
      const headers = [
        '順番',
        '氏名',
        '出身',
        '生年月日',
        '年齢\n（歳）',
        '身長\n（Cm）',
        '体重\n（Kg）',
        'IQテスト\n（50点）',
        '数学テスト\n（100点）',
        'クレペリン\n(2回、400点/回）',
        '写真',
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
      sheet.getColumn(11).width = 16;

      let currentRow = 3;
      for (let i = 0; i < list.length; i++) {
        const it = list[i];

        // merge cột
        sheet.mergeCells(`A${currentRow}:A${currentRow + 3}`);
        sheet.mergeCells(`B${currentRow}:B${currentRow + 1}`);
        sheet.mergeCells(`B${currentRow + 2}:B${currentRow + 3}`);
        ['C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((col) =>
          sheet.mergeCells(`${col}${currentRow}:${col}${currentRow + 3}`)
        );
        sheet.mergeCells(`J${currentRow}:J${currentRow + 1}`);
        sheet.mergeCells(`J${currentRow + 2}:J${currentRow + 3}`);
        sheet.mergeCells(`K${currentRow}:K${currentRow + 3}`);

        // gán dữ liệu
        sheet.getCell(`A${currentRow}`).value = i + 1;
        sheet.getCell(`B${currentRow}`).value = it.name;
        sheet.getCell(`B${currentRow + 2}`).value = it.namejp;
        sheet.getCell(`C${currentRow}`).value = it.city;
        sheet.getCell(`D${currentRow}`).value = changDateJP(it.birthday);
        sheet.getCell(`E${currentRow}`).value = it.age;
        sheet.getCell(`F${currentRow}`).value = it.height;
        sheet.getCell(`G${currentRow}`).value = it.weight;
        sheet.getCell(`H${currentRow}`).value = it.iq === 0 || it.iq == null ? '' : it.iq;
        sheet.getCell(`I${currentRow}`).value = it.math === 0 || it.math == null ? '' : it.math;
        sheet.getCell(`J${currentRow}`).value =
          it.kraepelin1 === 0 || it.kraepelin1 == null ? '' : it.kraepelin1;
        sheet.getCell(`J${currentRow + 2}`).value =
          it.kraepelin2 === 0 || it.kraepelin2 == null ? '' : it.kraepelin2;

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
        const buf = await fetchImageBuffer(it.avatar);
        if (buf) {
          const imgId = workbook.addImage({ buffer: buf, extension: 'jpeg' });
          // tính offset đơn giản lệch phải 0.2, xuống 0.2
          sheet.addImage(imgId, {
            tl: { col: 10 + 0.95, row: currentRow - 1 + 0.33 },
            ext: { width: 70, height: 70 },
            editAs: 'oneCell',
          });
        }

        currentRow += 4;
      }

      // auto width (ngoại trừ cột ảnh)
      // Auto width (ngoại trừ cột ảnh)
      sheet.columns.forEach((col, idx) => {
        if (idx !== 10) {
          let ml = 10;
          // Kiểm tra trước khi gọi eachCell
          if (typeof col.eachCell === 'function') {
            col.eachCell((cell) => {
              const l = String(cell.value ?? '').length + 3;
              if (l > ml) ml = l;
            });
          }
          col.width = ml;
        }
      });

      const buf = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buf], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        `${name}.xlsx`
      );
    } catch (err) {
      console.error(err);
      alert('Xuất Excel thất bại');
    }
  };

  return (
    <MenuItem onClick={handleExport}>
      <Iconify icon="file-icons:microsoft-excel" />
      Xuất Excel
    </MenuItem>
  );
};

export default ExportInternsWithAvatar;
