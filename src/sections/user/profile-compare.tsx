/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable arrow-body-style */

import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';

// _mock
import axios from 'axios';

import { _socials } from 'src/_mock';
// utils
import { fNumber } from 'src/utils/format-number';
// types
import {
  IContactItem,
  IInternItem,
  IStudyItem,
  IUserProfile,
  IUserProfilePost,
} from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { t } from 'i18next';

//
import ProfilePostItem from './profile-post-item';
import StudyPostItem from './study-post-item';
import AllStudyPDF from '../order/AllStudyPDF';
import AppAreaInstalled from '../overview/app/app-area-installed';
import AnalyticsCurrentSubject from '../overview/analytics/analytics-current-subject';
import TourDetailsBookers from '../tour/tour-details-bookers';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
  currentIntern?: IInternItem;
};

export default function ProfileCompare({ info, posts, currentIntern }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loadingDownloadAll, setLoadingDownloadAll] = useState(false);

  const [contact, setContact] = useState<IContactItem>();
  const [study, setStudy] = useState<IStudyItem[]>([]);
  const [studies, setStudies] = useState<any>([]);
  const [compare, setCompare] = useState();

  const { user } = useAuthContext();

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleGetContactByInternId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/contact/getByInternId`,
      { internId: currentIntern?._id }
    );
    setContact(data.contact);
  }, [currentIntern]);

  const handleGetCompareByAccountId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/compare/getByAccountId`,
      { accountId: user?._id }
    );
    setCompare(data.compare);
    console.log('Compare', data.compare);
    const tempStudies = [];
    for (const intern of data.compare.listIntern) {
      const { data: tempData } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/study/listByInternId`,
        { internId: intern._id }
      );
      tempStudies.push(tempData);
      // console.log('Study', tempData.studies);
    }
    setStudies(tempStudies);
    console.log("NEW",tempStudies);
    // setStudy(tempData.studies);
  }, [user]);

  // const handleGetByInternId = useCallback(async (internId) => {
  //   const { data } = await axios.post(
  //     `${process.env.REACT_APP_HOST_API}/api/study/listByInternId`,
  //     { internId: currentIntern?._id }
  //   );
  //   setStudy(data.studies);
  // }, [currentIntern]);

  const handleRemoveStudy = useCallback(async (id: any) => {
    setStudy((pre: any) => pre.filter((item: any) => item._id !== id));
  }, []);

  useEffect(() => {
    handleGetCompareByAccountId();
    // handleGetByInternId();
  }, [handleGetCompareByAccountId]);

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {/* {fNumber(info.totalFollowers)} */}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            <Tooltip title={t('download_study') || ''}>
              <IconButton
                onClick={async () => {
                  try {
                    setLoadingDownloadAll(true);
                    const blob = await pdf(
                      <AllStudyPDF intern={currentIntern} study={study} />
                    ).toBlob();
                    saveAs(blob, `${currentIntern?.name || 'Test'}.pdf`);
                  } catch (error) {
                    console.error('Lỗi khi tạo PDF:', error);
                  } finally {
                    setLoadingDownloadAll(false);
                  }
                }}
              >
                <Iconify
                  icon={loadingDownloadAll ? 'eos-icons:loading' : 'ic:baseline-download'}
                  width={32} // tăng kích thước icon (mặc định ~24)
                  height={32}
                  color="success.main"
                />
                {/* {loadingDownloadAll ? 'Đang tạo PDF...' : 'Tải tất cả CV'} */}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        {/* <Stack width={1}>
           {fNumber(info.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box> 
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended">
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Stack>

        <Button variant="contained">Post</Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Mạng Xã hội" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {_socials.map((link) => (
          <Stack
            key={link.name}
            spacing={2}
            direction="row"
            sx={{ wordBreak: 'break-all', typography: 'body2' }}
          >
            <Iconify
              icon={link.icon}
              width={24}
              sx={{
                flexShrink: 0,
                color: link.color,
              }}
            />
            <Link color="inherit">
              {link.value === 'facebook' && info.socialLinks.facebook}
              {link.value === 'instagram' && info.socialLinks.instagram}
              {link.value === 'linkedin' && info.socialLinks.linkedin}
              {link.value === 'twitter' && info.socialLinks.twitter}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  const newStudy = study.slice(0, 3).map((item: any) => ({
    name: `${item.time}ヶ月`,
    data: [item.write, item.read, item.listen, item.speak, item.health, item.attend],
  }));
  console.log('sd', newStudy);

  const studyCate = study.map((item: any) => item.time).reverse();
  const studyTotal = study.map((item: any) => item.total).reverse();
  const studyListen = study.map((item: any) => item.listen).reverse();
  const studyRead = study.map((item: any) => item.read).reverse();
  const studySpeak = study.map((item: any) => item.speak).reverse();
  const studyWrite = study.map((item: any) => item.write).reverse();
  let result = 0;
  if (studyTotal.length >= 2) {
    result = studyTotal[studyTotal.length - 1] - studyTotal[studyTotal.length - 1 - 1];
  }

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={12} lg={12}>
        <TourDetailsBookers bookers={compare || []} onRefresh={handleGetCompareByAccountId} />
      </Grid>
      <Grid xs={8} md={8} lg={8}>
        <AppAreaInstalled
          title={t('learning_ability') || ''}
          subheader={`${result >= 0 ? t('increase') : t('decrease')}${Math.abs(result)}${t('sub')}`}
          chart={{
            // categories: [
            //   '一月',
            //   '二月',
            //   '三月',
            //   '四月	',
            //   '五月',
            //   '六月	',
            //   '七月',
            //   '八月',
            //   '九月',
            //   '十月	',
            //   '十一月	',
            //   '十二月	',
            // ]
            categories: studyCate,
            series: [
              {
                year: t('learn_total'),
                // data: [
                //   // {
                //   //   name: t('learn_total'),
                //   //   data: studyTotal,
                //   // },
                //   {
                //     name: t('learn_total'),
                //     data: studyTotal,
                //   },
                //   // {
                //   //   name: 'America',
                //   //   data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                //   // },
                // ],
                data: studies.map((item : any) => {
                  return {
                    name: 'Test',
                    data: []
                  }
                }) 
              },
              {
                year: t('learn_part'),
                data: [
                  {
                    name: t('learn_listen'),
                    data: studyListen,
                  },
                  {
                    name: t('learn_read'),
                    data: studyRead,
                  },
                  {
                    name: t('learn_speak'),
                    data: studySpeak,
                  },
                  {
                    name: t('learn_write'),
                    data: studyWrite,
                  },
                ],
              },
            ],
          }}
        />
      </Grid>
      <Grid xs={4} md={4} lg={4}>
        <AnalyticsCurrentSubject
          title="日本語能力"
          chart={{
            categories: ['筆記力', '読解力', '聴解力', '会話力', '健康状態', '出席状況'],
            // series: [
            //   { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
            //   { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
            //   { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
            // ],
            series: newStudy || [],
          }}
        />
      </Grid>

      {user?.role === 'admin' && (
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            {renderFollows}

            {/* {renderSocials} */}
          </Stack>
        </Grid>
      )}

      {user?.role !== 'admin' && (
        <Grid xs={24} md={24} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Stack spacing={3}>{renderFollows}</Stack>
        </Grid>
      )}

      <Grid xs={user?.role === 'admin' ? 12 : 24} md={user?.role === 'admin' ? 8 : 24}>
        <Stack spacing={3}>
          {/* {renderPostInput} */}
          {/* {renderFollows} */}

          {study.map((item) => (
            <StudyPostItem
              key={item._id}
              study={item}
              intern={currentIntern || null}
              onRemove={handleRemoveStudy}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
