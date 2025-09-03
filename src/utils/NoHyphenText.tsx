import React from 'react';
import { Text } from '@react-pdf/renderer';

const ZWSP = '\u200B';

// chèn ZWSP sau mỗi n ký tự, xóa soft-hyphen
function addZWSP(text: string, n = 6) {
  if (!text) return '';
  const cleaned = text.replace(/\u00AD/g, '');
  // chèn ZWSP mỗi n ký tự
  return cleaned.replace(new RegExp(`(.{${n}})`, 'g'), `$1${ZWSP}`);
}

// render bằng cách chunk mỗi cụm có ZWSP, mỗi chunk là <Text> con
export function NoHyphenText({ children, style, chunk = 6 }: { children?: any; style?: any; chunk?: number }) {
  const s = addZWSP(String(children ?? ''), chunk);
  // chia theo ZWSP (giữ ZWSP ở cuối chunk) -> tạo các node nhỏ, engine không hyphenate giữa node
  const parts = s.split(ZWSP).map(p => p || ''); 
  return (
    <Text style={style}>
      {parts.map((p, i) => (
        <Text key={i}>{p}</Text>
      ))}
    </Text>
  );
}
