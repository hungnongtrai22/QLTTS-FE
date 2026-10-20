import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

// _mock
import axios from 'axios';

import { _bookingNew, _socials } from 'src/_mock';
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
import { t } from 'i18next';

//
import StudyOverview from './study-overview';
import BookingNewest from '../overview/booking/booking-newest';
// import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
  currentIntern?: IInternItem;
};

export default function ProfileHome({ info, posts, currentIntern }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState<IContactItem>();
  // undefined = đang tải
  const [study, setStudy] = useState<IStudyItem[]>();
  const { user } = useAuthContext();
  // const {t} = useLocales();

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

  // Admin / nguồn thấy cả báo cáo chưa công khai; nghiệp đoàn, công ty chỉ thấy bản đã công khai.
  const handleGetByInternId = useCallback(async () => {
    if (!currentIntern?._id) return;
    if (user?.role === 'admin' || user?.role === 'source') {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/study/listByInternId`,
        { internId: currentIntern?._id }
      );
      setStudy(data.studies);
    } else {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/study/listByInternIdPublic`,
        { internId: currentIntern?._id }
      );
      setStudy(data.studies);
    }
  }, [currentIntern, user]);

  const handleRemoveStudy = useCallback((id: string) => {
    setStudy((pre) => (pre || []).filter((item) => item._id !== id));
  }, []);

  useEffect(() => {
    handleGetContactByInternId();
    handleGetByInternId();
  }, [handleGetContactByInternId, handleGetByInternId]);

  const renderAbout = (
    <Card>
      <CardHeader title="Thông tin liên lạc" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Thông tin cá nhân</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.address}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          <Link variant="subtitle2" color="inherit">
            {contact?.email}
          </Link>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="tabler:phone-filled" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.phone}
            </Link>
          </Box>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Thông tin bố</Box>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="iconamoon:profile-fill" width={24} sx={{ mr: 2 }} />
          <Link variant="subtitle2" color="inherit">
            {currentIntern?.family?.find((item: any) => item.relationship === '父')?.name}
          </Link>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.addressDadAndMom}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="tabler:phone-filled" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.phoneDad}
            </Link>
          </Box>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Thông tin mẹ</Box>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="iconamoon:profile-fill" width={24} sx={{ mr: 2 }} />
          <Link variant="subtitle2" color="inherit">
            {currentIntern?.family?.find((item: any) => item.relationship === '母')?.name}
          </Link>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.addressDadAndMom}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="tabler:phone-filled" width={24} />

          <Box sx={{ typography: 'body2' }}>
            <Link variant="subtitle2" color="inherit">
              {contact?.phoneMom}
            </Link>
          </Box>
        </Stack>
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

  return (
    <Grid container spacing={3}>
      {/* Học tập: tóm tắt tháng, diễn biến, bảng đánh giá — xem study-overview.tsx */}
      <Grid xs={12}>
        <StudyOverview
          studies={study}
          intern={currentIntern}
          onChanged={handleGetByInternId}
          onRemoved={handleRemoveStudy}
        />
      </Grid>

      {currentIntern?.certificate?.length > 0 && (
        <Grid xs={12} md={12} lg={12}>
          <BookingNewest
            title={`${t('list_certificate')}`}
            subheader={`${t('num_certificate1')}${currentIntern?.certificate?.length}${t(
              'num_certificate2'
            )}`}
            list={currentIntern?.certificate}
          />
        </Grid>
      )}

      {user?.role === 'admin' && (
        <Grid xs={12} md={6}>
          {renderAbout}
        </Grid>
      )}
    </Grid>
  );
}
