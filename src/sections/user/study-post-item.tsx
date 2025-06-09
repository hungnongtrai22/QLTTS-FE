import { useState, useRef, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// types
import { IInternItem, IStudyItem, IUserProfilePost } from 'src/types/user';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import styles from './study-style.module.css';

// ----------------------------------------------------------------------

interface Props {
  study: IStudyItem;
  intern: any;
}

export default function StudyPostItem({ study, intern }: Props) {
  const { user } = useMockedUser();

  const commentRef = useRef<HTMLInputElement>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  console.log(study);
  console.log(intern);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={<Avatar src={intern?.avatar} alt={intern?.name} />}
      title={
        <Link color="inherit" variant="subtitle1">
          {`${intern?.name} (${intern?.namejp})`} 
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {fDate(study.createdAt)}
        </Box>
      }
      action={
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      }
    />
  );

  const renderCommentList = (
    <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
      <Stack direction="row" spacing={2}>
        <Avatar alt="das" src="/assets/logo.png" />

        <Paper
          sx={{
            p: 1.5,
            flexGrow: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Stack
            sx={{ mb: 0.5 }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            direction={{ xs: 'column', sm: 'row' }}
          >
            <Box sx={{ typography: 'subtitle2' }}>日本語の先生</Box>

            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>{fDate(new Date())}</Box>
          </Stack>

          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            ひらがなとカタカナは覚えていますが、読むスピードはまだ遅いです。挨拶の時、声はまだ小さくて、間違うこともあります。会話の時、習った言葉や文型を使おうとしていますが、ミスがあり、反応があまり速くないので、自習時間に教師や友達と会話練習をさせます。
          </Box>
        </Paper>
      </Stack>
    </Stack>
  );

  const renderInput = (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(0, 3, 3, 3),
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName} />

      <InputBase
        fullWidth
        value={message}
        inputRef={commentRef}
        placeholder="Write a comment…"
        onChange={handleChangeMessage}
        endAdornment={
          <InputAdornment position="end" sx={{ mr: 1 }}>
            <IconButton size="small" onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton size="small">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          pl: 1.5,
          height: 40,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </Stack>
  );

  // const renderActions = (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     sx={{
  //       p: (theme) => theme.spacing(2, 3, 3, 3),
  //     }}
  //   >
  //     <FormControlLabel
  //       control={
  //         <Checkbox
  //           defaultChecked
  //           color="error"
  //           icon={<Iconify icon="solar:heart-bold" />}
  //           checkedIcon={<Iconify icon="solar:heart-bold" />}
  //         />
  //       }
  //       label={fShortenNumber(post.personLikes.length)}
  //       sx={{ mr: 1 }}
  //     />

  //     {!!post.personLikes.length && (
  //       <AvatarGroup
  //         sx={{
  //           [`& .${avatarGroupClasses.avatar}`]: {
  //             width: 32,
  //             height: 32,
  //           },
  //         }}
  //       >
  //         {post.personLikes.map((person) => (
  //           <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
  //         ))}
  //       </AvatarGroup>
  //     )}

  //     <Box sx={{ flexGrow: 1 }} />

  //     <IconButton onClick={handleClickComment}>
  //       <Iconify icon="solar:chat-round-dots-bold" />
  //     </IconButton>

  //     <IconButton>
  //       <Iconify icon="solar:share-bold" />
  //     </IconButton>
  //   </Stack>
  // );

  return (
    <Card>
      {renderHead}

      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        学習期間: 1
      </Typography>

      <Box sx={{ p: 1 }}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th className={styles.th} colSpan={7}>
                （B）一般評価
              </th>
              <th className={styles.th} colSpan={7}>
                （C）日本語能力・知識習得度
              </th>
              <th className={styles.th} rowSpan={3}>
                (D)総合評価
              </th>
              <th className={styles.th} rowSpan={3}>
                学習進捗
              </th>
            </tr>
            <tr className={styles.tr}>
              <th className={styles.th} rowSpan={2}>
                性格
              </th>
              <th className={styles.th} rowSpan={2}>
                健康状態
              </th>
              <th className={styles.th} rowSpan={2}>
                協調性
              </th>
              <th className={styles.th} rowSpan={2}>
                出席状況
              </th>
              <th className={styles.th} rowSpan={2}>
                規律厳守
              </th>
              <th className={styles.th} rowSpan={2}>
                学習態度
              </th>
              <th className={styles.th} rowSpan={2}>
                オリエンテーション知識の取得度
              </th>
              <th className={styles.th} colSpan={4}>
                日本語能力
              </th>
              <th className={styles.th} rowSpan={2}>
                学力
              </th>
              <th className={styles.th} colSpan={2}>
                日本語能力試験
              </th>
            </tr>
            <tr className={styles.tr}>
              <th className={styles.th}>筆記力</th>
              <th className={styles.th}>読解力</th>
              <th className={styles.th}>聴解力</th>
              <th className={styles.th}>会話力</th>
              <th className={styles.th}>レベル</th>
              <th className={styles.th}>合格判定</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr className={styles.tr}>
              <td className={styles.td}>いつも笑顔で、熱心</td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ●
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ●
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ●
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ◎
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ◎
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                ◎
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                △
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                △
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                △
              </td>
              <td
                className={styles.td}
                style={{
                  fontSize: '20px',
                }}
              >
                △
              </td>
              <td className={styles.td}>B-</td>
              <td className={styles.td}>N5</td>
              <td className={styles.td}>不</td>
              <td className={styles.td}>良</td>
              <td className={styles.td}>皆の日本語第3課</td>
            </tr>
          </tbody>
        </table>
      </Box>

      {/* {renderActions} */}

      {renderCommentList}
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ p: 1 }}>
          {/* <Image alt={post.media} src={post.media} ratio="16/9" sx={{ borderRadius: 1.5 }} /> */}
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th} colSpan={3}>
                  (B) (C)
                </th>
                <th className={styles.th} colSpan={3}>
                  (D)総合評価
                </th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  ●
                </td>
                <td className={styles.td}>＜100点</td>
                <td className={styles.td}>
                  <b>秀</b>
                </td>
                <td className={styles.td}>100%</td>
                <td className={styles.td}>(D) ＜1000満点</td>
                <td className={styles.td}>
                  <b>秀</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  ◎
                </td>
                <td className={styles.td}>＜90点</td>
                <td className={styles.td}>
                  <b>優</b>
                </td>
                <td className={styles.td}>90%</td>
                <td className={styles.td}>(D) ＜900点</td>
                <td className={styles.td}>
                  <b>優</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  ○
                </td>
                <td className={styles.td}>＜80点</td>
                <td className={styles.td}>
                  <b>良</b>
                </td>
                <td className={styles.td}>80%</td>
                <td className={styles.td}>(D) ＜800点</td>
                <td className={styles.td}>
                  <b>良</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  △
                </td>
                <td className={styles.td}>＜70点</td>
                <td className={styles.td}>
                  <b>可</b>
                </td>
                <td className={styles.td}>70%</td>
                <td className={styles.td}>(D) ＜700点</td>
                <td className={styles.td}>
                  <b>可</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td
                  className={styles.td}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  ×
                </td>
                <td className={styles.td}>＜50点</td>
                <td className={styles.td}>
                  <b>不可</b>
                </td>
                <td className={styles.td}>50%</td>
                <td className={styles.td}>(D) ＜500点</td>
                <td className={styles.td}>
                  <b>不可</b>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Box sx={{ p: 1 }}>
          {/* <Image alt={post.media} src={post.media} ratio="16/9" sx={{ borderRadius: 1.5 }} /> */}
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th} colSpan={4}>
                  （C）学力
                </th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              <tr className={styles.tr}>
                <td className={styles.td}>900点≦平均点数≦1000点</td>
                <td className={styles.td}>
                  <b>A+</b>
                </td>
                <td className={styles.td}>60点≦平均点数＜70点</td>
                <td className={styles.td}>
                  <b>B</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>80点≦平均点数＜90点</td>
                <td className={styles.td}>
                  <b>A</b>
                </td>
                <td className={styles.td}>50点≦平均点数＜60点</td>
                <td className={styles.td}>
                  <b>B-</b>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>70点≦平均点数＜80点</td>
                <td className={styles.td}>
                  <b>B+</b>
                </td>
                <td className={styles.td}>0点≦平均点数＜50点</td>
                <td className={styles.td}>
                  <b>C</b>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>

      {/* {renderInput}  */}
    </Card>
  );
}
