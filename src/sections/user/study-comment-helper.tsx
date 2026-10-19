import { m } from 'framer-motion';
import { ReactNode, useMemo, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// locales
import { useLocales } from 'src/locales';
// utils
import {
  STUDY_COMMENT_GROUPS,
  StudyCommentGroup,
  StudyCommentInput,
  StudyCommentSuggestion,
  appendCommentSentence,
  studyCommentGroup,
  studyCommentSuggestions,
} from 'src/utils/studyComment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { COMMENT_MAX, commentText } from './study-bulk-utils';

// ----------------------------------------------------------------------

type Props = {
  // HTML của trình soạn thảo
  comment: string;
  input: StudyCommentInput;
  // Nhận xét của báo cáo trước đó (HTML) — có thì hiện nút chép sang để sửa tiếp
  prevComment?: string;
  // Vd "tháng trước", "tháng 08/2026"
  prevLabel: string;
  disabled?: boolean;
  onChange: (html: string) => void;
  // Ô soạn thảo nhận xét: đặt giữa thanh nút và bảng câu mẫu, để bấm câu nào là thấy ngay câu
  // đó hiện trong ô phía trên.
  children: ReactNode;
};

type TabValue = 'suggest' | StudyCommentGroup;

// Trượt ngắn + mờ dần, nhanh: chỉ để dẫn mắt khi đổi nhóm câu.
const fadeIn = varFade({ distance: 8, durationIn: 0.24 }).inUp;

// Mỗi mục điểm lấy một câu (câu đầu tiên khớp) để ghép đoạn nháp không bị lặp ý.
const draftSentences = (suggestions: StudyCommentSuggestion[]) => {
  const seen = new Set<string>();
  return suggestions.filter((item) => {
    const key = item.reason?.field ?? item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function StudyCommentHelper({
  comment,
  input,
  prevComment,
  prevLabel,
  disabled = false,
  onChange,
  children,
}: Props) {
  const { t, currentLang } = useLocales();

  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState<TabValue>('suggest');

  const [askReplace, setAskReplace] = useState(false);

  const text = commentText(comment);

  const prevText = commentText(prevComment || '');

  const suggestions = useMemo(() => studyCommentSuggestions(input), [input]);

  const list = useMemo(
    () => (tab === 'suggest' ? suggestions : studyCommentGroup(tab, input)),
    [tab, suggestions, input]
  );

  const hasScores = Object.values(input.scores).some((value) => typeof value === 'number');

  // Câu chưa có trong nhận xét, theo thứ tự, vừa đủ giới hạn ký tự.
  const draft = useMemo(() => {
    let { length } = text;
    return draftSentences(suggestions).filter((item) => {
      if (text.includes(item.jp) || length + item.jp.length > COMMENT_MAX) return false;
      length += item.jp.length;
      return true;
    });
  }, [suggestions, text]);

  const showVi = currentLang.value === 'vi';

  const reasonLabel = (item: StudyCommentSuggestion) => {
    if (!item.reason) return null;
    const { field, value } = item.reason;
    if (field === 'delta') {
      return t('study_comment_reason_delta', { value: value > 0 ? `+${value}` : value });
    }
    return `${t(`study_bulk_col_${field}`)} ${value}`;
  };

  const handleInsert = (sentence: string) => onChange(appendCommentSentence(comment, sentence));

  const handleDraft = () =>
    onChange(draft.reduce((html, item) => appendCommentSentence(html, item.jp), comment));

  const handleCopyPrev = () => {
    if (text) setAskReplace(true);
    else onChange(prevComment || '');
  };

  const renderItem = (item: StudyCommentSuggestion) => {
    const added = text.includes(item.jp);
    const fits = text.length + item.jp.length <= COMMENT_MAX;
    const reason = reasonLabel(item);
    const secondary = [
      showVi ? item.vi : '',
      !added && !fits ? t('study_comment_too_long', { max: COMMENT_MAX }) : '',
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <ListItemButton
        key={item.id}
        disabled={disabled || added || !fits}
        onClick={() => handleInsert(item.jp)}
        // Điện thoại: nhãn lý do xuống dưới câu (thẳng hàng với chữ) để câu không bị bóp hẹp.
        sx={{
          borderRadius: 1,
          alignItems: 'flex-start',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          columnGap: 1.5,
          rowGap: 0.5,
          py: 1,
        }}
      >
        <Iconify
          icon={added ? 'eva:checkmark-fill' : 'mingcute:add-line'}
          width={18}
          sx={{ mt: 0.25, flexShrink: 0, color: added ? 'success.main' : 'primary.main' }}
        />
        <ListItemText
          primary={item.jp}
          secondary={secondary || undefined}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ typography: 'caption', component: 'span' }}
          sx={{ m: 0, flexBasis: { xs: 'calc(100% - 30px)', sm: 'auto' } }}
        />
        {(reason || added) && (
          <Label
            variant="soft"
            color={added ? 'success' : 'default'}
            sx={{ flexShrink: 0, mt: { xs: 0, sm: 0.25 }, ml: { xs: 3.75, sm: 0 } }}
          >
            {added ? t('study_comment_added') : reason}
          </Label>
        )}
      </ListItemButton>
    );
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {!!prevText && prevText !== text && (
          <Button
            variant="outlined"
            color="inherit"
            disabled={disabled}
            startIcon={<Iconify icon="solar:copy-bold" />}
            onClick={handleCopyPrev}
            sx={{ minHeight: { xs: 44, md: 36 } }}
          >
            {t('study_comment_copy_prev', { month: prevLabel })}
          </Button>
        )}
        <Button
          variant={open ? 'soft' : 'outlined'}
          color={open ? 'primary' : 'inherit'}
          disabled={disabled}
          aria-expanded={open}
          startIcon={<Iconify icon="solar:magic-stick-3-bold" />}
          endIcon={
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          }
          onClick={() => setOpen((prev) => !prev)}
          sx={{ minHeight: { xs: 44, md: 36 } }}
        >
          {t('study_comment_suggest')}
          {suggestions.length > 0 && (
            <Label variant="filled" color="primary" sx={{ ml: 1 }}>
              {suggestions.length}
            </Label>
          )}
        </Button>
      </Stack>

      {children}

      <Collapse in={open && !disabled} unmountOnExit>
        <Box
          sx={{
            borderRadius: 1.5,
            border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
            bgcolor: 'background.neutral',
          }}
        >
          <Tabs
            value={tab}
            onChange={(event, value) => setTab(value)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              px: 1.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              '& .MuiTab-root': { minHeight: 44 },
            }}
          >
            <Tab value="suggest" label={t('study_comment_tab_suggest')} />
            {STUDY_COMMENT_GROUPS.map((group) => (
              <Tab key={group} value={group} label={t(`study_comment_group_${group}`)} />
            ))}
          </Tabs>

          {tab === 'suggest' && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={1}
              sx={{ px: 2, pt: 1.5 }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {hasScores ? t('study_comment_draft_hint') : t('study_comment_no_scores')}
              </Typography>
              <Button
                size="small"
                variant="contained"
                disabled={!draft.length}
                onClick={handleDraft}
                startIcon={<Iconify icon="solar:pen-new-square-bold" />}
                sx={{ flexShrink: 0, minHeight: { xs: 44, md: 30 } }}
              >
                {t('study_comment_draft', { count: draft.length })}
              </Button>
            </Stack>
          )}

          {/* key theo tab: đổi nhóm thì danh sách hiện lại nhẹ nhàng */}
          <Box
            key={tab}
            component={m.div}
            initial="initial"
            animate="animate"
            variants={fadeIn}
            // Điện thoại: để cả trang / hộp thoại cuộn, tránh khung cuộn lồng nhau dễ kẹt khi vuốt.
            sx={{
              maxHeight: { xs: 'none', sm: 320 },
              overflowY: { xs: 'visible', sm: 'auto' },
              p: 1,
            }}
          >
            {list.length ? (
              <List disablePadding>{list.map(renderItem)}</List>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 1, py: 2 }}>
                {t('study_comment_no_scores')}
              </Typography>
            )}
          </Box>

          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'text.disabled', px: 2, pb: 1.5 }}
          >
            {t('study_comment_click_hint')}
          </Typography>
        </Box>
      </Collapse>

      <ConfirmDialog
        open={askReplace}
        onClose={() => setAskReplace(false)}
        title={t('study_comment_replace_title')}
        content={t('study_comment_replace_content', { month: prevLabel })}
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              onChange(prevComment || '');
              setAskReplace(false);
            }}
          >
            {t('study_comment_replace')}
          </Button>
        }
      />
    </Stack>
  );
}
