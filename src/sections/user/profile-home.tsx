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

//
import ProfilePostItem from './profile-post-item';
import StudyPostItem from './study-post-item';
import AllStudyPDF from '../order/AllStudyPDF';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
  currentIntern?: IInternItem;
};

export default function ProfileHome({ info, posts, currentIntern }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loadingDownloadAll, setLoadingDownloadAll] = useState(false);

  const [contact, setContact] = useState<IContactItem>();
  const [study, setStudy] = useState<IStudyItem[]>([]);
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

  const handleGetByInternId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/study/listByInternId`,
      { internId: currentIntern?._id }
    );
    setStudy(data.studies);
  }, [currentIntern]);

  useEffect(() => {
    handleGetContactByInternId();
    handleGetByInternId();
  }, [handleGetContactByInternId, handleGetByInternId]);

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {/* {fNumber(info.totalFollowers)} */}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            <Tooltip title="Tải PDF">
              <IconButton
                onClick={async () => {
                  try {
                    setLoadingDownloadAll(true);
                    const blob = await pdf(
                      <AllStudyPDF intern={currentIntern} study={study} />
                    ).toBlob();
                    saveAs(blob, `All_CVs_${currentIntern?.name || 'Test'}.pdf`);
                  } catch (error) {
                    console.error('Lỗi khi tạo PDF:', error);
                  } finally {
                    setLoadingDownloadAll(false);
                  }
                }}
              >
                <Iconify icon={loadingDownloadAll ? 'eos-icons:loading' : 'ic:baseline-download'} />
                {/* {loadingDownloadAll ? 'Đang tạo PDF...' : 'Tải tất cả CV'} */}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(info.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

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
            {currentIntern?.family?.find((item: any) => item.relationship === '姉')?.name}
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
            {currentIntern?.family?.find((item: any) => item.relationship === '兄')?.name}
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
      {user?.role === 'admin' && (
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            {renderFollows}

            {renderAbout}

            {/* {renderSocials} */}
          </Stack>
        </Grid>
      )}

      <Grid xs={user?.role === 'admin' ? 12 : 24} md={user?.role === 'admin' ? 8 : 24}>
        <Stack spacing={3}>
          {/* {renderPostInput} */}

          {study.map((item) => (
            <StudyPostItem key={item._id} study={item} intern={currentIntern || null} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
