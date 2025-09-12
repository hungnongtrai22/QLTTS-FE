/* eslint-disable @typescript-eslint/no-unused-expressions */

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IUserProfileGallery } from 'src/types/user';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { t } from 'i18next';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { MenuItem } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  gallery: any[];
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function ProfileGallery({ gallery }: Props) {
  const theme = useTheme();

  const slides = gallery.map((slide) => {
    const url = slide.imageUrl[0]; // chỉ lấy phần tử đầu tiên

    if (url.includes('/video/')) {
      return {
        type: 'video' as const, // 👈 ép literal type
        sources: [
          {
            src: url,
            type: 'video/mp4',
          },
        ],
        poster: url,
        src: url,
        width: 1280,
        height: 720,
      };
    }

    return {
      src: url,
    };
  });

  const lightbox = useLightBox(slides);
  const popover = usePopover();
  const [idSelect, setIdSelect] = useState(null);

  console.log('gallery', slides);

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        {t('gallery')}
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {gallery.map((image) => (
          <Card key={image.id} sx={{ cursor: 'pointer', color: 'common.white' }}>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              // onClick={() => {
              //   setIdSelect(image?._id);
              //   popover.onOpen;
              // }}

              onClick={popover.onOpen}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 9 }}
            >
              <Iconify icon="eva:more-vertical-fill" 
              onClick={() => {
                setIdSelect(image?._id);
              }}
              />
            </IconButton>

            <ListItemText
              sx={{
                p: 3,
                left: 0,
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
              }}
              primary={image.title}
              secondary={changDateJP(image.postedAt)}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle1',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: 'inherit',
                component: 'span',
                typography: 'body2',
                sx: { opacity: 0.48 },
              }}
            />

            <Image
              alt="gallery"
              ratio="1/1"
              src={image.imageUrl[0]}
              onClick={() => lightbox.onOpen(image.imageUrl[0])}
              overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
                theme.palette.grey[900]
              } 75%)`}
            />
          </Card>
        ))}
      </Box>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={async () => {
            if (idSelect) {
              const url = paths.dashboard.gallery.profile(idSelect);
              window.open(url, '_blank');
            }
            popover.onClose();
          }}
        >
          <Iconify icon="lsicon:view-filled" />
          Xem chi tiết
        </MenuItem>

        <MenuItem onClick={() => {}}>
          <Iconify icon="material-symbols:delete" />
          Xóa
        </MenuItem>
        {/* <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem>
      
              <MenuItem
                onClick={() => {
                  onViewRow();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:eye-bold" />
                View
              </MenuItem> */}
      </CustomPopover>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        disabledVideo={false}
      />
    </>
  );
}
