// ----------------------------------------------------------------------
// Hợp đồng đưa người lao động đi làm việc ở nước ngoài (Mẫu số 03).
//
// Đây là nguồn dữ liệu DUY NHẤT cho cả bản PDF (sections/invoice/intern-pdf-contract.tsx)
// lẫn bản Excel (utils/ExportContract.tsx): thông tin Bên đưa đi, bảng phí và cách đọc dữ
// liệu TTS đều nằm ở đây. Đổi phí / đổi người đại diện thì chỉ sửa file này.
//
// Nội dung điều khoản được trích nguyên văn từ file mẫu "MẪU HĐLĐ.xlsx" (sheet HĐLĐ).
// File mẫu Excel (public/assets/templates/hop-dong-lao-dong.xlsx) mang bản sao riêng của
// các điều khoản dài; khi Bộ Nội Vụ đổi mẫu thì phải sửa cả hai nơi.
// ----------------------------------------------------------------------

export const CONTRACT_FORM = {
  code: 'Mẫu số 03',
  title: ['HỢP ĐỒNG ĐƯA NGƯỜI LAO ĐỘNG ĐI LÀM VIỆC', 'Ở NƯỚC NGOÀI'],
  legalBasis: '(Ban hành kèm theo Thông tư số 09/2026/TT – BNV ngày 15/05/2026 của Bộ Nội Vụ)',
};

export const CONTRACT_SENDER = {
  name: 'CÔNG TY TNHH ĐÀO TẠO VÀ CUNG ỨNG NHÂN LỰC NHẬT TÂN',
  nameTitleCase: 'Công Ty TNHH Đào Tạo Và Cung Ứng Nhân Lực Nhật Tân',
  shortName: 'NHATTAN MANPOWER',
  address: 'Số 8 TX01, Phường Thới An, Tp. Hồ Chí Minh.',
  phone: '028 6274 5444',
  email: 'nhattan@nhattangroup.vn',
  website: 'nhattangroup.vn',
  representative: 'NGUYỄN KHẮC QUANG HUY',
  position: 'Giám Đốc',
};

// Ngày ký Hợp đồng cung ứng lao động giữa Nhật Tân và nghiệp đoàn. File mẫu ghi cố định
// một ngày cho mọi nghiệp đoàn; giữ nguyên như vậy.
export const SUPPLY_CONTRACT_DATE = '27/06/2024';

// Cập nhật cùng lúc với tổng các dòng phí trong CONTRACT_CLAUSES.
export const CONTRACT_FEES_IN_WORDS = 'Chín mươi triệu đồng chẵn./.';

export const PASSPORT_ISSUER = 'Cục Quản Lý Xuất Nhập Cảnh';

// Điều 1 — thời hạn hợp đồng lao động, file mẫu ghi cố định cho mọi người.
export const CONTRACT_TERM = '03 năm 0 tháng 0 ngày';

// ----------------------------------------------------------------------

export type ContractMoneyField =
  | 'trainingAllowance'
  | 'salary'
  | 'tax'
  | 'socialInsurance'
  | 'housingFee';

export type ContractBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'text'; text: string; bold?: boolean }
  // `row`: dòng tương ứng trong sheet HĐLĐ của file mẫu Excel, để bản Excel ghi đè số tiền
  | { kind: 'fee'; row: number; label: string; amount: number; bold?: boolean }
  | { kind: 'feeWords' }
  | { kind: 'money'; label: string; field: ContractMoneyField; suffix: string };

// Điều 2 -> hết hợp đồng. Phần đầu (các bên, Điều 1) có nhiều dữ liệu TTS nên dựng riêng.
export const CONTRACT_CLAUSES: ContractBlock[] = [
  { kind: 'heading', text: 'Điều 2: Quyền và nghĩa vụ của người lao động' },
  {
    kind: 'text',
    text: '2.1.Tham gia đầy đủ khóa học giáo dục định hướng trước khi đi làm việc tại Nhật bản do Bên đưa đi tổ chức; trong thời gian 30 ngày; đảm bảo thời lượng 74 tiết, kiểm tra đạt kết quả và được cấp Giấy chứng nhận hoàn thành khóa học.',
  },
  {
    kind: 'text',
    text: '2.2. Tham gia khóa bồi dưỡng kỹ năng nghề do Bên đưa đi tổ chức (nếu có) trong thời gian 30 ngày. Phí bồi dưỡng kỹ năng nghề do Công Ty TNHH Đào Và Cung Ứng Nhân Lực Nhật Tân chi trả.',
  },
  {
    kind: 'text',
    text: '2.3. Tham gia khóa đào tạo ngoại ngữ tiếng Nhật do Bên đưa đi tổ chức (nếu có) trong thời gian 180 ngày. Phí đào tạo ngoại ngữ tiếng là 5.900.000 đồng, do người lao động chi trả.',
  },
  { kind: 'text', text: '2.4. Chi phí người lao động phải trả trước khi đi:' },
  { kind: 'fee', row: 42, label: '- Tiền dịch vụ :', amount: 40000000 },
  { kind: 'text', text: '+ Thời gian nộp (1 lần): Tối thiểu trước xuất cảnh 5 ngày' },
  { kind: 'fee', row: 44, label: '- Tiền đóng góp Quỹ hỗ trợ việc làm ngoài nước', amount: 100000 },
  { kind: 'fee', row: 45, label: '- Chi phí đi lại từ Việt Nam đến nơi làm việc:', amount: 0 },
  { kind: 'fee', row: 46, label: '- Lệ phí cấp hộ chiếu', amount: 200000 },
  { kind: 'fee', row: 47, label: '- Lệ phí cấp thị thực (visa)', amount: 2870000 },
  { kind: 'fee', row: 48, label: '- Lệ phí lý lịch tư pháp', amount: 200000 },
  { kind: 'fee', row: 49, label: '- Tiền khám sức khỏe', amount: 7000000 },
  { kind: 'text', text: '- Các chi phí khác:' },
  {
    kind: 'fee',
    row: 51,
    label: '+ Chi phí đi lại trong thời gian đào tạo (6 tháng - 9 tháng)',
    amount: 14630000,
  },
  { kind: 'fee', row: 52, label: '+ Mua sắm tư trang, vật dụng', amount: 20000000 },
  { kind: 'fee', row: 53, label: '+ Chi phí đưa đón đến sân bay trước khi bay', amount: 3000000 },
  { kind: 'fee', row: 54, label: '+ Chi phí tiêm ngừa', amount: 2000000 },
  { kind: 'fee', row: 55, label: 'Tổng cộng', amount: 90000000, bold: true },
  { kind: 'feeWords' },
  { kind: 'text', text: '2.5. Ký kết và thực hiện hợp đồng lao động với người sử dụng lao động.' },
  { kind: 'text', text: '2.6. Thời gian thử việc: Không' },
  { kind: 'text', text: '2.7. Thời gian đào tạo tại nước tiếp nhận:' },
  { kind: 'text', text: '- Thời gian đào tạo: trong vòng 01 tháng sau khi nhập cảnh' },
  {
    kind: 'money',
    label: '- Mức lương/trợ cấp đào tạo:',
    field: 'trainingAllowance',
    suffix: 'Yên/tháng (Bao gồm tiền ăn).',
  },
  {
    kind: 'text',
    text: '- Điều kiện/chi phí ăn/ ở: Người lao động được Công ty sử dụng lao động/ Bên nước ngoài tiếp nhận lao động cung cấp (miễn phí hoặc có phí) chỗ ở và được cung cấp (miễn phí hoặc có phí)…. Bữa ăn hoặc các thiết bị (điện, gas,…), dụng cụ nấu ăn cần thiết để tự nấu ăn.',
  },
  { kind: 'text', text: '2.8. Thời gian làm việc, nghỉ ngơi:' },
  {
    kind: 'text',
    text: '- Thời gian làm việc: 08 giờ/ngày, 5 ngày/tuần theo quy định của pháp luật Nhật Bản. Ngoài thời gian này được tính là thời gian làm thêm giờ.',
  },
  {
    kind: 'text',
    text: '- Người lao động được nghỉ các ngày lễ, Tết theo quy định của Luật pháp Nhật Bản, đó là các ngày: (Ngày đầu năm mới: 1/1; ngày Quốc Khánh: 11/2; ngày xuân phân: 20/3; ngày Chiêu Hòa: 29/4; ngày kỷ niệm Hiến pháp: 3/5; ngày cây xanh: 4/5; ngày thiếu nhi: 5/5; ngày của biển; ngày của núi: 11/8; ngày kính lão; ngày thu phân: 23/9; ngày thể dục thể thao; ngày văn hóa: 3/11; ngày tạ ơn người lao động: 23/11; ngày sinh nhật của Thiên hoàng, ...).',
  },
  {
    kind: 'text',
    text: '- Ngoài ra, người lao động được 10 ngày phép có hưởng lương hàng năm theo quy định của Pháp luật Nhật Bản.',
  },
  {
    kind: 'text',
    text: '2.9. Tiền lương, tiền làm thêm giờ, tiền thưởng và các khoản người lao động phải nộp (nếu có):',
  },
  { kind: 'text', text: '- Tiền lương, tiền làm thêm giờ, tiền thưởng/phụ cấp:' },
  { kind: 'money', label: '+ Tiền lương:', field: 'salary', suffix: 'Yên/tháng' },
  {
    kind: 'text',
    text: '+ Tiền làm thêm giờ: Theo quy định luật pháp Nhật Bản, tùy thuộc vào công việc',
  },
  {
    kind: 'text',
    text: '+ Các khoản tiền thưởng/phụ cấp (chuyên cần, hỗ trợ ăn, ở, ca kíp,……): Theo quy định xí nghiệp tiếp nhận Nhật Bản.',
  },
  { kind: 'text', text: '+ Ngày trả lương: ngày 25 hàng tháng' },
  { kind: 'text', text: '+ Hình thức trả lương: chuyển khoản ngân hàng' },
  {
    kind: 'text',
    text: '- Các khoản người lao động phải nộp theo quy định của pháp luật nước tiếp nhận lao động:',
  },
  { kind: 'money', label: '+ Thuế:', field: 'tax', suffix: 'Yên' },
  {
    kind: 'money',
    label: '+ Bảo hiểm xã hội, bảo hiểm việc làm:',
    field: 'socialInsurance',
    suffix: 'Yên',
  },
  { kind: 'money', label: '+ Tiền thuê nhà:', field: 'housingFee', suffix: 'Yên' },
  { kind: 'text', text: '2.10. Điều kiện ăn, ở, sinh hoạt:' },
  {
    kind: 'text',
    text: 'Được người sử dụng lao động/Bên nước ngoài tiếp nhận lao động cung cấp (miễn phí hoặc có phí) chỗ ở và được cung cấp (miễn phí hoặc có phí)…. bữa ăn hoặc các thiết bị (điện, gas,...), dụng cụ nấu ăn cần thiết để tự nấu ăn.',
  },
  { kind: 'text', text: '2.11. Bảo hiểm:' },
  { kind: 'text', text: 'Được tham gia và hưởng chế độ bảo hiểm:' },
  { kind: 'text', text: '- Bảo hiểm xã hội' },
  { kind: 'text', text: '- Bảo hiểm y tế' },
  { kind: 'text', text: '- Bảo hiểm tai nạn lao động, bệnh nghề nghiệp' },
  { kind: 'text', text: '- Bảo hiểm khác (nếu có)' },
  { kind: 'text', text: '2.12. An toàn, vệ sinh lao động:' },
  {
    kind: 'text',
    text: 'Được cung cấp miễn phí trang thiết bị bảo hộ lao động theo từng vị trí việc làm và đảm bảo an toàn, vệ sinh lao động theo pháp luật nước tiếp nhận lao động và quy chế của người sử dụng lao động.',
  },
  { kind: 'text', text: '2.13. Chi phí đi lại:' },
  {
    kind: 'text',
    text: '- Chi phí đi lại từ Việt Nam đến nơi làm việc tại nước tiếp nhận do Nghiệp đoàn Nhật Bản chi trả;',
  },
  {
    kind: 'text',
    text: '- Chi phí đi lại từ nơi làm việc tại nước tiếp nhận về Việt Nam sau khi người lao động hoàn thành hợp đồng do Nghiệp đoàn Nhật Bản chi trả;',
  },
  { kind: 'text', text: '- Trường hợp người lao động phải về nước trước hạn:' },
  {
    kind: 'text',
    text: '+ Do lỗi của người lao động thì chi phí chi phí đi lại từ nơi làm việc tại Nhật Bản về Việt Nam do người lao động chi trả.',
  },
  {
    kind: 'text',
    text: '+ Không do lỗi của người lao động thì chi phí đi lại từ nơi làm việc tại Nhật Bản về Việt Nam do Xí nghiệp tiếp nhận chi trả.',
  },
  {
    kind: 'text',
    text: '2.14. Chăm sóc sức khỏe sinh sản, ốm đau, thương tật, tử vong: Được khám, chữa bệnh, được hưởng chế độ bảo hiểm theo quy định pháp luật Nhật Bản và được hỗ trợ từ Quỹ Hỗ trợ Việc làm ngoài nước theo quy định của pháp luật Việt Nam.',
  },
  {
    kind: 'text',
    text: '2.15. Trường hợp thay đổi nơi làm việc hoặc thay đổi người sử dụng lao động phải thông báo cho Bên đưa đi trong thời hạn 05 ngày kể từ ngày có sự thay đổi.',
  },
  {
    kind: 'text',
    text: '2.16. Thực hiện thanh lý hợp đồng này trong thời hạn 180 ngày kể từ ngày chấm dứt hợp đồng; nếu không thanh lý hợp đồng, Bên đưa đi được đơn phương thanh lý hợp đồng theo quy định của pháp luật.',
  },
  {
    kind: 'text',
    text: '2.17. Bồi thường cho Bên đưa đi theo thỏa thuận nêu tại Điều 6 hợp đồng này và quy định của pháp luật có liên quan.',
  },
  {
    kind: 'text',
    text: '2.18. Yêu cầu Bên đưa đi bồi thường thiệt hại do Bên đưa đi gây ra theo quy định tại Điều 6 hợp đồng này và quy định của pháp luật có liên quan.',
  },
  {
    kind: 'text',
    text: '2.19. Được hưởng các quyền và thực hiện các nghĩa vụ khác theo quy định của pháp luật.',
  },
  { kind: 'heading', text: 'Điều 3: Quyền và nghĩa vụ của Bên đưa đi' },
  { kind: 'text', text: '3.1. Thu tiền dịch vụ nêu trong Điểm 2.4 Điều 2 của Hợp đồng này;' },
  {
    kind: 'text',
    text: '3.2. Tổ chức giáo dục định hướng cho người lao động, đảm bảo thời lượng 74 tiết theo quy định.',
  },
  {
    kind: 'text',
    text: '3.3. Thỏa thuận với người lao động về việc bồi dưỡng kỹ năng nghề, tiếng Nhật cho người lao động theo yêu cầu của bên tiếp nhận lao động.',
  },
  {
    kind: 'text',
    text: '3.4. Phối hợp với bên tiếp nhận hoàn tất hồ sơ, giấy tờ để người lao động xuất, nhập cảnh hợp pháp và đến nơi làm việc.',
  },
  {
    kind: 'text',
    text: '3.5. Đảm bảo người lao động được ký kết hợp đồng lao động với người sử dụng lao động với các điều khoản phù hợp với hợp đồng này.',
  },
  {
    kind: 'text',
    text: '3.6. Phối hợp với Bên nước ngoài tiếp nhận hỗ trợ người lao động trong việc gửi tiền lương và các khoản thu nhập hợp pháp của người lao động về Việt Nam theo đúng quy định của pháp luật;',
  },
  {
    kind: 'text',
    text: '3.7. Tổ chức quản lý, bảo vệ quyền, lợi ích hợp pháp của người lao động trong thời gian người lao động làm việc ở nước ngoài;',
  },
  {
    kind: 'text',
    text: '3.8. Phối hợp với bên tiếp nhận lao động tổ chức, hướng dẫn cho người lao động xuất, nhập cảnh về nước theo hợp đồng đã ký.',
  },
  {
    kind: 'text',
    text: '3.9. Hỗ trợ người lao động hoặc thân nhân người lao động về các thủ tục để được hưởng các chế độ bảo hiểm theo quy định của Nhật Bản, Quỹ Hỗ trợ việc làm ngoài nước theo quy định và các chính sách hỗ trợ khác của Nhà nước (nếu có).',
  },
  {
    kind: 'text',
    text: '3.10. Bồi thường cho người lao động, người bảo lãnh (nếu có) về những thiệt hại do Bên đưa đi gây ra theo quy định tại Điều 6 hợp đồng này, hợp đồng bảo lãnh (nếu có) và quy định của pháp luật có liên quan.',
  },
  {
    kind: 'text',
    text: '3.11. Yêu cầu người lao động hoặc người bảo lãnh bồi thường thiệt hại theo thỏa thuận nêu tại Điều 6 hợp đồng này, hợp đồng bảo lãnh (nếu có) và quy định của pháp luật có liên quan.',
  },
  {
    kind: 'text',
    text: '3.12. Thanh lý Hợp đồng đưa người lao động đi làm việc ở nước ngoài theo quy định của pháp luật.',
  },
  {
    kind: 'text',
    text: '3.13. Được hưởng các quyền và thực hiện các nghĩa vụ khác theo quy định của pháp luật.',
  },
  { kind: 'heading', text: 'Điều 4: Thời gian xuất cảnh' },
  {
    kind: 'text',
    text: '4.1. Bên đưa đi có trách nhiệm đưa người lao động đi làm việc ở nước ngoài không quá 180 ngày kể từ ngày người lao động trúng tuyển đi làm việc ở nước ngoài theo văn bản cam kết của Công ty.',
  },
  {
    kind: 'text',
    text: '4.2. Trong thời gian nêu tại khoản 4.1 Điều này, nếu người lao động không còn nguyện vọng đi làm việc ở nước ngoài thì Bên đưa đi trả lại hồ sơ (hộ chiếu, sơ yếu lý lịch, bằng cấp…) và người lao động phải chịu các khoản chi phí đã chi (nếu có) để làm thủ tục cho người lao động đi làm việc ở nước ngoài: phí giao thông từ Việt Nam đến nơi làm việc, tiền học ngoại ngữ, tiền bồi dưỡng kỹ năng nghề, tiền làm hộ chiếu, phí xin cấp thị thực (visa), tiền khám sức khỏe, …',
  },
  {
    kind: 'text',
    text: '4.3. Quá thời hạn nêu tại khoản 4.1 Điều này, nếu Bên đưa đi vẫn chưa đưa người lao động đi làm việc ở nước ngoài, Bên đưa đi phải thông báo rõ lý do cho người lao động. Trường hợp người lao động không còn nhu cầu đi làm việc ở nước ngoài thì trong thời hạn 15 ngày kể từ ngày người lao động thông báo không còn nhu cầu đi làm việc ở nước ngoài, Bên đưa đi phải trả lại cho người lao động hồ sơ đã thu, giữ và hoàn trả các khoản tiền người lao động đã nộp cho Bên đưa đi bao gồm tiền dịch vụ, đóng góp Quỹ Hỗ trợ việc làm ngoài nước, phí giao thông từ Việt Nam đến nơi làm việc, phí cấp thị thực (visa), …; và Bên đưa đi làm thủ tục hoàn trả tiền ký quỹ (nếu có) cho người lao động.',
  },
  {
    kind: 'text',
    text: '4.4. Trường hợp bất khả kháng (thiên tai, dịch bệnh, chiến tranh, bất ổn chính trị hoặc tình trạng khẩn cấp) dẫn đến sau 180 ngày kể từ ngày người lao động trúng tuyển mà người lao động không còn nhu cầu đi làm việc ở nước ngoài và/hoặc Bên đưa đi không đưa được người lao động đi làm việc ở nước ngoài thì Bên đưa đi phải trả lại cho người lao động hồ sơ, hoàn trả người lao động tiền dịch vụ và các khoản chưa chi. Đối với các khoản đã chi theo quy định, Bên đưa đi hoàn trả người lao động theo thỏa thuận giữa người lao động và Bên đưa đi.',
  },
  { kind: 'heading', text: 'Điều 5: Thỏa thuận ký quỹ' },
  { kind: 'text', text: 'Hai bên không tiến hành bất cứ thỏa thuận ký quỹ nào.' },
  { kind: 'heading', text: 'Điều 6: Điều khoản bồi thường thiệt hại' },
  {
    kind: 'text',
    text: 'Bên đưa đi và người lao động thỏa thuận việc bồi thường thiệt hại, mức bồi thường thiệt hại trong các trường hợp sau:',
  },
  {
    kind: 'text',
    text: '- Bên đưa đi không đưa được người lao động đi làm việc ở nước ngoài được nêu tại khoản 4.3 Điều 4 của Hợp đồng này, mức bồi thường theo quy định của pháp luật.',
  },
  {
    kind: 'text',
    text: '- Bên đưa đi không đảm bảo các nội dung nêu tại Điều 1; khoản 2.6, 2.7, 2.8, 2.9 và 2.10 Điều 2 của Hợp đồng này, mức bồi thường là theo quy định của pháp luật.',
  },
  {
    kind: 'text',
    text: '- Người lao động tự ý chấm dứt hợp đồng trái pháp luật hoặc ở lại nước ngoài trái pháp luật sau khi chấm dứt hợp đồng, mức bồi thường theo quy định pháp luật(trừ trường hợp nước, vùng lãnh thổ tiếp nhận lao động hoặc hợp đồng cung ứng lao động không quy định người lao động phải bồi thường).',
  },
  { kind: 'heading', text: 'Điều 7: Thời hạn hợp đồng' },
  {
    kind: 'text',
    text: '- Hợp đồng này có thời hạn 36 tháng kể từ ngày ký và có thể gia hạn với thời gian 24 tháng',
  },
  {
    kind: 'text',
    text: '- Trong trường hợp gia hạn, tiền dịch vụ mà người lao động phải trả cho Bên đưa đi là: 0 đồng.',
  },
  {
    kind: 'text',
    text: '- Quyền và nghĩa vụ của hai Bên trong thời gian gia hạn hợp đồng được thực hiện theo các điều khoản trong Hợp đồng này',
  },
  {
    kind: 'text',
    text: '- Trường hợp Bên đưa đi không đảm bảo các nội dung nêu tại Điều 1 nhưng người lao động có nguyện vọng tiếp tục làm việc ở nước ngoài thì hai Bên thỏa thuận bằng văn bản các nội dung thay đổi tại Điều 1 của Hợp đồng này.',
  },
  { kind: 'heading', text: 'Điều 8: Thanh lý hợp đồng' },
  { kind: 'text', text: '8.1. Hai Bên thanh lý hợp đồng trong các trường hợp sau:' },
  { kind: 'text', text: '- Người lao động không còn nguyện vọng đi thực tập ở nước ngoài;' },
  {
    kind: 'text',
    text: '- Bên đưa đi không đưa được người lao động đi làm việc ở nước ngoài trong trường hợp 180 ngày kể từ ngày người lao động trúng tuyển;',
  },
  { kind: 'text', text: '- Người lao động chấm dứt hợp đồng lao động;' },
  {
    kind: 'text',
    text: '- Người lao động vi phạm hợp đồng lao động, tự ý bỏ hợp đồng ra ngoài làm việc bất hợp pháp;',
  },
  {
    kind: 'text',
    text: '- Các trường hợp khác theo quy định của pháp luật Việt Nam và pháp luật nước tiếp nhận lao động.',
  },
  {
    kind: 'text',
    text: '8.2.Tùy thuộc vào nguyên nhân dẫn đến việc chấm dứt hợp đồng lao động trước thời hạn, hai Bên sẽ xem xét việc thỏa thuận thanh lý hợp đồng, cụ thể như sau:',
  },
  {
    kind: 'text',
    text: '- Trong trường hợp bất khả kháng không thể tiếp tục thực hiện Hợp đồng (như xảy ra chiến tranh, thiên tai và các sự kiện khác nằm ngoài khả năng kiểm soát hợp lý của các Bên), hai bên sẽ cùng nhau giải quyết những vấn đề còn tồn tại và Bên đưa đi sẽ xem xét khả năng hỗ trợ cho lao động trên cơ sở những quy định hiện hành của pháp luật;',
  },
  {
    kind: 'text',
    text: '- Trường hợp người lao động bị chấm dứt hợp đồng và về nước trước thời hạn mà không do lỗi của người lao động, Bên đưa đi có trách nhiệm trả các khoản tiền theo quy định và bồi thường cho người lao động theo thỏa thuận;',
  },
  {
    kind: 'text',
    text: '- Trường hợp người lao động bị chấm dứt hợp đồng và phải về nước trước thời hạn do lỗi của người lao động, người lao động có trách nhiệm bồi thường Bên nước ngoài tiếp nhận lao động và Bên đưa đi về những thiệt hại do người lao động gây ra',
  },
  { kind: 'heading', text: 'Điều 9: Các thỏa thuận khác' },
  { kind: 'text', text: 'Không có' },
  { kind: 'heading', text: 'Điều 10: Giải quyết tranh chấp và luật áp dụng' },
  {
    kind: 'text',
    text: '10.1. Hợp đồng này được giải thích và điều chỉnh theo luật pháp Việt Nam.',
  },
  {
    kind: 'text',
    text: '10.2. Mọi tranh chấp phát sinh trên cơ sở Hợp đồng này sẽ được giải quyết trước hết bằng thương lượng giữa hai bên theo nguyên tắc bình đẳng, cùng có lợi.',
  },
  {
    kind: 'text',
    text: '10.3. Trường hợp tranh chấp không giải quyết được thông qua thương lượng hai bên sẽ đưa ra Tòa án có thẩm quyền để giải quyết theo quy định của pháp luật Việt Nam.',
  },
  {
    kind: 'text',
    text: 'Hợp đồng này được lập thành 02 bản bằng tiếng Việt, có giá trị như nhau, mỗi Bên giữ 01 bản để theo dõi và thực hiện.\nHai bên: Bên đưa đi – CÔNG TY TNHH ĐÀO TẠO VÀ CUNG ỨNG NHÂN LỰC NHẬT TÂN (NHATTAN MANPOWER) và Người lao động đã đọc kỹ, hiểu rõ các điều khoản trên đây, nhất trí ký tên.',
  },
];

export const CONTRACT_FEES = CONTRACT_CLAUSES.filter(
  (block): block is Extract<ContractBlock, { kind: 'fee' }> => block.kind === 'fee'
);

// ----------------------------------------------------------------------
// Định dạng

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

// Ngày trong CSDL là nửa đêm giờ Việt Nam (vd 2008-12-15T17:00:00Z = 16/12/2008).
// Quy về đúng ngày lịch Việt Nam, không phụ thuộc múi giờ của máy đang in.
function toVNParts(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const time = new Date(value as string).getTime();
  if (Number.isNaN(time)) return null;
  const vn = new Date(time + VN_OFFSET_MS);
  return { day: vn.getUTCDate(), month: vn.getUTCMonth() + 1, year: vn.getUTCFullYear() };
}

// Ngày dạng Date ở nửa đêm UTC — ExcelJS ghi Date theo giờ UTC, nên phải đưa về đây thì
// ô Excel mới hiện đúng ngày.
export function toExcelDate(value: unknown): Date | null {
  const parts = toVNParts(value);
  return parts ? new Date(Date.UTC(parts.year, parts.month - 1, parts.day)) : null;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function formatContractDate(value: unknown): string {
  const parts = toVNParts(value);
  return parts ? `${pad(parts.day)}/${pad(parts.month)}/${parts.year}` : '';
}

// "ngày 1 tháng 7 năm 2026" — đúng cách file mẫu ghi (không có số 0 đứng đầu).
export function formatContractDateWords(value: unknown): string {
  const parts = toVNParts(value);
  return parts ? `ngày ${parts.day} tháng ${parts.month} năm ${parts.year}` : '';
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ----------------------------------------------------------------------
// Dữ liệu một hợp đồng, đọc từ hồ sơ TTS (đã populate tradeUnion + companySelect).

export type ContractData = {
  contractId: string;
  contractDate: string | null;
  honorific: string;
  name: string;
  gender: string;
  birthday: string | null;
  citizenId: string;
  citizenDate: string | null;
  citizenPlace: string;
  passportId: string;
  passportDate: string | null;
  phone: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  interviewDate: string | null;
  departureDate: string | null;
  address: string;
  tradeUnion: string;
  company: string;
  job: string;
  companyAddress: string;
  companyDirector: string;
  companyPhone: string;
} & Record<ContractMoneyField, number | null>;

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const money = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

// Hồ sơ lưu giới tính bằng tiếng Nhật (男/女); nhận thêm vài cách ghi khác cho chắc.
function readGender(value: unknown) {
  const g = text(value).toLowerCase();
  if (['男', 'nam', 'male', 'm'].includes(g)) return { gender: 'Nam', honorific: 'Ông' };
  if (['女', 'nữ', 'nu', 'female', 'f'].includes(g)) return { gender: 'Nữ', honorific: 'Bà' };
  return { gender: '', honorific: '' };
}

function joinAddress(...parts: unknown[]) {
  const seen: string[] = [];
  parts.map(text).forEach((part) => {
    // "Tỉnh/Thành phố" hay bị gõ lặp lại ở cuối địa chỉ thường trú — không ghép hai lần.
    if (part && !seen.some((prev) => prev.toLowerCase().includes(part.toLowerCase()))) {
      seen.push(part);
    }
  });
  return seen.join(', ');
}

export function buildContractData(intern: any): ContractData {
  const company =
    intern?.companySelect && typeof intern.companySelect === 'object' ? intern.companySelect : {};
  const tradeUnion =
    intern?.tradeUnion && typeof intern.tradeUnion === 'object' ? intern.tradeUnion : {};

  return {
    contractId: text(intern?.contractId),
    contractDate: intern?.contractDate || null,
    ...readGender(intern?.gender),
    name: text(intern?.name).toUpperCase(),
    birthday: intern?.birthday || null,
    citizenId: text(intern?.citizenId),
    citizenDate: intern?.citizenDate || null,
    citizenPlace: text(intern?.citizenPlace),
    passportId: text(intern?.passportId),
    passportDate: intern?.passportDate || null,
    phone: text(intern?.phone),
    emergencyName: text(intern?.emergencyContactName),
    emergencyRelationship: text(intern?.emergencyContactRelationship),
    emergencyPhone: text(intern?.emergencyContactPhone),
    interviewDate: intern?.interviewDate || null,
    departureDate: intern?.departureDate || null,
    address: joinAddress(intern?.street, intern?.state),
    tradeUnion: text(tradeUnion.name),
    company: text(company.name),
    job: text(intern?.field),
    // Ưu tiên ô "Địa chỉ" của công ty; chỉ ghép thành phố/tỉnh/quốc gia khi ô đó trống.
    companyAddress:
      text(company.address) || joinAddress(company.city, company.state, company.country),
    companyDirector: text(company.director),
    companyPhone: text(company.phone),
    trainingAllowance: money(company.trainingAllowance),
    salary: money(company.salary),
    tax: money(company.tax),
    socialInsurance: money(company.socialInsurance),
    housingFee: money(company.housingFee),
  };
}

// Tên file tải về, dùng chung cho PDF và Excel.
export function contractFileName(interns: any[], extension: 'pdf' | 'xlsx') {
  if (interns.length === 1) {
    const name = text(interns[0]?.name).toUpperCase() || 'TTS';
    return `Hợp đồng - ${name}.${extension}`;
  }
  return `Hợp đồng - ${interns.length} người.${extension}`;
}

// Các mục nên có trước khi in — trả về khoá i18n để nơi gọi dịch và cảnh báo.
// Thiếu thì vẫn in được: PDF để dòng chấm cho viết tay, Excel để ô trống.
const REQUIRED: [keyof ContractData, string][] = [
  ['contractId', 'contract_id'],
  ['contractDate', 'contract_date'],
  ['citizenId', 'citizen_id'],
  ['citizenDate', 'citizen_date'],
  ['citizenPlace', 'citizen_place'],
  ['passportId', 'passport_id'],
  ['passportDate', 'passport_date'],
  ['address', 'permanent_address'],
  ['emergencyName', 'labor_emergency'],
  ['emergencyPhone', 'contract_emergency_phone'],
  ['job', 'field_accepted'],
  ['interviewDate', 'contract_interview_date'],
  ['tradeUnion', 'trade_union'],
  ['company', 'contract_company'],
  ['companyAddress', 'contract_company_address'],
  ['companyDirector', 'company_director'],
  ['salary', 'company_salary'],
];

export function getMissingContractFields(data: ContractData): string[] {
  return REQUIRED.filter(([key]) => {
    const value = data[key];
    return value === null || value === undefined || value === '';
  }).map(([, i18nKey]) => i18nKey);
}
