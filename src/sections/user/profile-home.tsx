import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
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
import { IInternItem, IStudyItem, IUserProfile, IUserProfilePost } from 'src/types/user';
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

  // undefined = đang tải
  const [study, setStudy] = useState<IStudyItem[]>();
  const { user } = useAuthContext();
  // const {t} = useLocales();

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

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
    handleGetByInternId();
  }, [handleGetByInternId]);

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
    </Grid>
  );
}
