/* eslint-disable @typescript-eslint/no-unused-expressions */

import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import { t } from 'i18next';

// types
import { IUserProfileGallery } from 'src/types/user';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

type Props = {
  gallery: any[];
  onRefresh: any;
};

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function ProfileGallery({ gallery, onRefresh }: Props) {
  const theme = useTheme();

  const [indexSelect, setIndexSelect] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const lightbox = useLightBox(slides);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();
  const [idSelect, setIdSelect] = useState<string | null>(null);

  const handleDeleteGallery = useCallback(async (id : any) => {
      // const seletedRows = tableData.filter((row) => table.selected.includes(row._id));
  setLoading(true);
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/gallery/delete`,{
        _id: id
      });
      // console.log('TEST', user, listIntern);
      await onRefresh();
      enqueueSnackbar('Xóa ảnh thành công thành công!');
      setLoading(false);
    }, [enqueueSnackbar, onRefresh]);

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
        {gallery.map((image, index) => (
          <Card key={image.id} sx={{ cursor: 'pointer', color: 'common.white' }}>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 9 }}
            >
              <Iconify
                icon="eva:more-vertical-fill"
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
              onClick={() => {
                // Tạo slides trực tiếp từ image đang click
                const newSlides = image.imageUrl.map((url: string) =>
                  url.includes('/video/')
                    ? {
                        type: 'video' as const,
                        sources: [{ src: url, type: 'video/mp4' }],
                        poster: url,
                        src: url,
                        width: 1280,
                        height: 720,
                      }
                    : { src: url }
                );

                setSlides(newSlides); // cập nhật slides
                setIndexSelect(index); // lưu index
                lightbox.onOpen(newSlides[0].src); // mở lightbox ngay
              }}
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

        <MenuItem
          onClick={async () => {
            if (idSelect) {
              const url = paths.dashboard.gallery.edit(idSelect);
              window.open(url);
            }
            popover.onClose();
          }}
        >
          <Iconify icon="fa7-solid:edit" />
          Chỉnh Sửa
        </MenuItem>

        <MenuItem onClick={() => {
          console.log("IdSelect", idSelect);
          handleDeleteGallery(idSelect);
          setIdSelect(null);
        }}>
          <Iconify icon="material-symbols:delete" />
          {loading ? "Đang xóa..." : "Xóa"}
        </MenuItem>
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
