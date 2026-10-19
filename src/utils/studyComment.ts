import { IStudyScoreKey } from 'src/types/user';

// ----------------------------------------------------------------------
// Câu mẫu cho ô "Nhận xét" của báo cáo học tập.
//
// Nhận xét luôn viết bằng tiếng Nhật (100% báo cáo trong CSDL) nên câu mẫu là tiếng Nhật, kèm nghĩa
// tiếng Việt cho giáo viên. Câu lấy từ những câu giáo viên đã dùng nhiều nhất trong báo cáo thật
// (đã sửa lỗi ngữ pháp), cộng vài câu cho những trường hợp còn thiếu (điểm thấp, sức khỏe...).
//
// `when` = điều kiện để gợi ý câu đó cho TTS: điểm của mục `field` nằm trong [min, max] (thang 100),
// hoặc `delta` = tổng điểm so với tháng trước. Ngưỡng chọn theo phân bố điểm thật: các mục chung
// (sức khỏe, kỷ luật...) trung vị 100, các kỹ năng tiếng Nhật (nghe, nói, đọc, viết) trung vị 70.
// Câu không có `when` không tự gợi ý, chỉ hiện khi xem theo nhóm.
//
// Sửa / thêm câu: chỉ sửa ở đây.
// ----------------------------------------------------------------------

export type StudyCommentGroup =
  | 'rules'
  | 'attitude'
  | 'knowledge'
  | 'listen'
  | 'speak'
  | 'readWrite'
  | 'character'
  | 'closing';

export type StudyCommentField = IStudyScoreKey | 'delta';

export type StudyCommentPhrase = {
  id: string;
  group: StudyCommentGroup;
  jp: string;
  vi: string;
  when?: { field: StudyCommentField; min?: number; max?: number };
};

export const STUDY_COMMENT_GROUPS: StudyCommentGroup[] = [
  'rules',
  'attitude',
  'knowledge',
  'listen',
  'speak',
  'readWrite',
  'character',
  'closing',
];

// Tổng điểm thay đổi từ mức này so với tháng trước thì gợi ý câu "tiến bộ / sa sút".
export const STUDY_COMMENT_DELTA = 20;

export const STUDY_COMMENT_PHRASES: StudyCommentPhrase[] = [
  // Nề nếp, chuyên cần, sức khỏe
  {
    id: 'rules-keep',
    group: 'rules',
    jp: 'センターの規則をきちんと守っています。',
    vi: 'Chấp hành tốt nội quy của trung tâm.',
    when: { field: 'discipline', min: 95 },
  },
  {
    id: 'rules-tidy',
    group: 'rules',
    jp: '寮や教室で整理整頓ができており、研修センターの規則を守っています。',
    vi: 'Giữ gọn gàng ở ký túc xá và lớp học, tuân thủ nội quy trung tâm.',
    when: { field: 'discipline', min: 95 },
  },
  {
    id: 'rules-ontime',
    group: 'rules',
    jp: '宿題忘れや遅刻などはなく、問題ありません。',
    vi: 'Không quên bài tập, không đi muộn, không có vấn đề gì.',
    when: { field: 'attend', min: 95 },
  },
  {
    id: 'rules-late',
    group: 'rules',
    jp: '遅刻や欠席が見られるので、時間を守るよう指導しています。',
    vi: 'Còn đi muộn / vắng mặt, giáo viên đang nhắc nhở giữ đúng giờ.',
    when: { field: 'attend', max: 79 },
  },
  {
    id: 'rules-break',
    group: 'rules',
    jp: '規則を守れないことがあるので、注意しています。',
    vi: 'Đôi khi chưa tuân thủ nội quy, giáo viên đang nhắc nhở.',
    when: { field: 'discipline', max: 79 },
  },
  {
    id: 'rules-health',
    group: 'rules',
    jp: '体調を崩すことがあったので、健康管理に気をつけてほしいです。',
    vi: 'Có lúc không khỏe, mong em chú ý giữ gìn sức khỏe.',
    when: { field: 'health', max: 79 },
  },

  // Thái độ học tập, hợp tác
  {
    id: 'attitude-active',
    group: 'attitude',
    jp: '何事にも自分から積極的に取り組み、態度・姿勢は良いです。',
    vi: 'Chủ động, tích cực trong mọi việc, thái độ tốt.',
    when: { field: 'attitude', min: 95 },
  },
  {
    id: 'attitude-speak-up',
    group: 'attitude',
    jp: '積極的に授業に参加しており、授業中の発言も多いです。',
    vi: 'Tích cực tham gia giờ học, phát biểu nhiều.',
    when: { field: 'attitude', min: 95 },
  },
  {
    id: 'attitude-self-study',
    group: 'attitude',
    jp: '授業時間以外でもよく自習をしており、頑張っています。',
    vi: 'Tự học nhiều ngoài giờ học, rất cố gắng.',
    when: { field: 'attitude', min: 90 },
  },
  {
    id: 'attitude-quiet',
    group: 'attitude',
    jp: '授業での発言はあまり多くありませんが、真面目に授業に取り組んでいます。',
    vi: 'Ít phát biểu nhưng học tập nghiêm túc.',
    when: { field: 'attitude', min: 80, max: 94 },
  },
  {
    id: 'attitude-focus',
    group: 'attitude',
    jp: '授業中に集中できていないことがあるので、注意しています。',
    vi: 'Đôi khi mất tập trung trong giờ học, giáo viên đang nhắc nhở.',
    when: { field: 'attitude', max: 79 },
  },
  {
    id: 'attitude-team',
    group: 'attitude',
    jp: '友だちと仲が良く、協力しながら勉強できています。',
    vi: 'Hòa đồng với bạn bè, biết hợp tác khi học.',
    when: { field: 'cooperation', min: 95 },
  },
  {
    id: 'attitude-team-low',
    group: 'attitude',
    jp: 'グループ活動にも、もっと積極的に参加してほしいです。',
    vi: 'Mong em tích cực tham gia hoạt động nhóm hơn.',
    when: { field: 'cooperation', max: 79 },
  },

  // Tiếp thu kiến thức, tiến bộ so với tháng trước
  {
    id: 'knowledge-high',
    group: 'knowledge',
    jp: '文法の理解度が高く、筆記テストの成績も良いです。',
    vi: 'Hiểu ngữ pháp tốt, điểm kiểm tra viết cao.',
    when: { field: 'acquiringKnowledge', min: 95 },
  },
  {
    id: 'knowledge-self-fix',
    group: 'knowledge',
    jp: 'まだ間違えるときもありますが、自分で間違いに気づいて訂正できます。',
    vi: 'Đôi khi còn sai nhưng tự nhận ra và sửa được.',
    when: { field: 'acquiringKnowledge', min: 75, max: 94 },
  },
  {
    id: 'knowledge-low',
    group: 'knowledge',
    jp: '文法の定着率が低いので、もっと問題をたくさん解いて練習する必要があります。',
    vi: 'Ngữ pháp chưa vững, cần làm nhiều bài tập hơn.',
    when: { field: 'acquiringKnowledge', max: 74 },
  },
  {
    id: 'knowledge-forget',
    group: 'knowledge',
    jp: '覚えた単語を忘れてしまうことがあるので、毎日復習するよう指導しています。',
    vi: 'Hay quên từ đã học, giáo viên hướng dẫn ôn tập mỗi ngày.',
    when: { field: 'acquiringKnowledge', max: 74 },
  },
  {
    id: 'knowledge-up',
    group: 'knowledge',
    jp: '先月と比べて、成績が向上しています。',
    vi: 'Kết quả tiến bộ so với tháng trước.',
    when: { field: 'delta', min: STUDY_COMMENT_DELTA },
  },
  {
    id: 'knowledge-down',
    group: 'knowledge',
    jp: '先月と比べて成績が下がっているので、復習に力を入れる必要があります。',
    vi: 'Kết quả giảm so với tháng trước, cần tập trung ôn tập.',
    when: { field: 'delta', max: -STUDY_COMMENT_DELTA },
  },

  // Nghe
  {
    id: 'listen-high',
    group: 'listen',
    jp: '聴解は特によくできています。',
    vi: 'Nghe hiểu đặc biệt tốt.',
    when: { field: 'listen', min: 85 },
  },
  {
    id: 'listen-understand',
    group: 'listen',
    jp: '相手が伝えたいことをよく理解できています。',
    vi: 'Hiểu tốt điều người khác muốn nói.',
    when: { field: 'listen', min: 85 },
  },
  {
    id: 'listen-short',
    group: 'listen',
    jp: '単語や短文であればよく聞き取れていますが、文が長くなると難しいようです。',
    vi: 'Nghe tốt từ và câu ngắn, câu dài thì còn khó.',
    when: { field: 'listen', min: 60, max: 84 },
  },
  {
    id: 'listen-slow',
    group: 'listen',
    jp: '話すスピードが速いと苦戦しますが、ゆっくり話せば正確に聞き取れています。',
    vi: 'Người nói nhanh thì còn vất vả, nói chậm thì nghe chính xác.',
    when: { field: 'listen', min: 60, max: 84 },
  },
  {
    id: 'listen-low',
    group: 'listen',
    jp: '聴解力がまだ弱いので、CDなどを使って毎日聞く練習をする必要があります。',
    vi: 'Nghe còn yếu, cần luyện nghe mỗi ngày (CD...).',
    when: { field: 'listen', max: 59 },
  },

  // Nói
  {
    id: 'speak-high',
    group: 'speak',
    jp: '会話では、自分の考えをはっきり伝えることができます。',
    vi: 'Khi hội thoại, truyền đạt rõ ràng suy nghĩ của mình.',
    when: { field: 'speak', min: 85 },
  },
  {
    id: 'speak-present',
    group: 'speak',
    jp: '発表の時は、落ち着いてしっかり話せています。',
    vi: 'Khi phát biểu, nói bình tĩnh và chắc chắn.',
    when: { field: 'speak', min: 85 },
  },
  {
    id: 'speak-slow',
    group: 'speak',
    jp: '会話では、質問に対する反応にやや時間がかかることがあります。',
    vi: 'Khi hội thoại, đôi khi phản xạ trả lời còn chậm.',
    when: { field: 'speak', min: 60, max: 84 },
  },
  {
    id: 'speak-pronounce',
    group: 'speak',
    jp: '発音にまだ課題があるので、引き続き練習が必要です。',
    vi: 'Phát âm còn hạn chế, cần tiếp tục luyện.',
    when: { field: 'speak', max: 69 },
  },
  {
    id: 'speak-low',
    group: 'speak',
    jp: '話す量が少ないので、会話の練習を増やし、習った単語や文法を使えるようにする必要があります。',
    vi: 'Nói còn ít, cần luyện hội thoại nhiều hơn để dùng được từ và ngữ pháp đã học.',
    when: { field: 'speak', max: 59 },
  },

  // Đọc, viết
  {
    id: 'read-high',
    group: 'readWrite',
    jp: '読解問題もよくできています。',
    vi: 'Làm tốt bài đọc hiểu.',
    when: { field: 'read', min: 80 },
  },
  {
    id: 'read-low',
    group: 'readWrite',
    jp: '読解に時間がかかるので、もっと文章を読む練習が必要です。',
    vi: 'Đọc hiểu còn chậm, cần luyện đọc nhiều hơn.',
    when: { field: 'read', max: 54 },
  },
  {
    id: 'write-high',
    group: 'readWrite',
    jp: '字が丁寧で、書く問題もよくできています。',
    vi: 'Chữ viết cẩn thận, làm tốt bài viết.',
    when: { field: 'write', min: 85 },
  },
  {
    id: 'write-low',
    group: 'readWrite',
    jp: '書くときに間違いが見られるので、漢字や文の書き方を復習する必要があります。',
    vi: 'Khi viết còn sai, cần ôn lại cách viết kanji và câu.',
    when: { field: 'write', max: 59 },
  },

  // Tính cách (câu theo ô "Tính cách" do studyCommentSuggestions tự sinh thêm)
  {
    id: 'character-honest',
    group: 'character',
    jp: '素直で、真面目です。',
    vi: 'Ngoan, nghiêm túc.',
  },
  {
    id: 'character-popular',
    group: 'character',
    jp: '明るい性格で、クラスの人気者です。',
    vi: 'Tính cách vui vẻ, được cả lớp yêu mến.',
  },
  {
    id: 'character-greeting',
    group: 'character',
    jp: '先生や周りの人に、笑顔できちんと挨拶ができています。',
    vi: 'Chào hỏi thầy cô và mọi người lễ phép, vui vẻ.',
  },

  // Câu kết
  {
    id: 'closing-no-problem',
    group: 'closing',
    jp: '現時点では、特に大きな問題はありません。',
    vi: 'Hiện tại không có vấn đề gì lớn.',
  },
  {
    id: 'closing-keep-going',
    group: 'closing',
    jp: '今後も引き続き頑張ってほしいと思います。',
    vi: 'Mong em tiếp tục cố gắng.',
  },
  {
    id: 'closing-support',
    group: 'closing',
    jp: 'これからも応援しています。',
    vi: 'Thầy cô luôn ủng hộ em.',
  },
];

// ----------------------------------------------------------------------

export type StudyCommentInput = {
  scores: Partial<Record<IStudyScoreKey, number | null | undefined>>;
  // Tổng điểm so với đúng tháng trước; null = không so được
  delta: number | null;
  // Ô "Tính cách" (tiếng Nhật, vd "明るく、熱心")
  characteristic: string;
};

export type StudyCommentSuggestion = StudyCommentPhrase & {
  // Mục điểm làm câu này được gợi ý, để hiện lý do (vd "Nghe 88")
  reason?: { field: StudyCommentField; value: number };
};

const valueOf = (input: StudyCommentInput, field: StudyCommentField): number | null => {
  const value = field === 'delta' ? input.delta : input.scores[field];
  return typeof value === 'number' && !Number.isNaN(value) ? value : null;
};

const matches = (phrase: StudyCommentPhrase, input: StudyCommentInput) => {
  if (!phrase.when) return null;
  const value = valueOf(input, phrase.when.field);
  if (value === null) return null;
  const { min = -Infinity, max = Infinity } = phrase.when;
  return value >= min && value <= max ? { field: phrase.when.field, value } : null;
};

// Câu theo ô "Tính cách" — ô này là cụm tiếng Nhật chọn sẵn (characteristicList) hoặc gõ tự do.
const characterPhrase = (characteristic: string): StudyCommentSuggestion | null => {
  const value = characteristic.trim().replace(/[。.]+$/, '');
  if (!value) return null;
  return {
    id: 'character-field',
    group: 'character',
    jp: `性格は${value}です。`,
    vi: `Tính cách: ${value}`,
  };
};

// Câu gợi ý cho một TTS theo điểm tháng này, giữ thứ tự nhóm để ghép lại thành đoạn văn xuôi:
// nề nếp → thái độ → kiến thức → nghe → nói → đọc/viết → tính cách.
export function studyCommentSuggestions(input: StudyCommentInput): StudyCommentSuggestion[] {
  const result: StudyCommentSuggestion[] = [];
  STUDY_COMMENT_PHRASES.forEach((phrase) => {
    const reason = matches(phrase, input);
    if (reason) result.push({ ...phrase, reason });
  });
  const character = characterPhrase(input.characteristic);
  if (character) result.push(character);
  return result;
}

// Toàn bộ câu của một nhóm (kể cả câu không thỏa điều kiện điểm) — để giáo viên tự chọn.
export function studyCommentGroup(
  group: StudyCommentGroup,
  input: StudyCommentInput
): StudyCommentSuggestion[] {
  const phrases: StudyCommentSuggestion[] = STUDY_COMMENT_PHRASES.filter(
    (phrase) => phrase.group === group
  ).map((phrase) => {
    const reason = matches(phrase, input);
    return reason ? { ...phrase, reason } : phrase;
  });
  if (group === 'character') {
    const character = characterPhrase(input.characteristic);
    if (character) phrases.unshift(character);
  }
  return phrases;
}

// ----------------------------------------------------------------------

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Nối một câu vào cuối nhận xét (HTML của trình soạn thảo). Nhận xét trong CSDL là một đoạn văn
// liền (<p>...</p>) nên câu mới nối tiếp vào đoạn cuối thay vì mở đoạn mới.
export function appendCommentSentence(html: string, sentence: string): string {
  const safe = escapeHtml(sentence);
  const text = (html || '').replace(/<[^>]*>/g, '').trim();
  if (!text) return `<p>${safe}</p>`;
  if (/<\/p>\s*$/i.test(html)) return html.replace(/<\/p>\s*$/i, `${safe}</p>`);
  return `${html}${safe}`;
}
