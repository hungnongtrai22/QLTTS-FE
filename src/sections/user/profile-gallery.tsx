/* eslint-disable @typescript-eslint/no-unused-expressions */

import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import { t } from 'i18next';

// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { paths } from 'src/routes/paths';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------
// Tab Album của hồ sơ TTS. Mọi role xem được; chỉ admin sửa / xóa (BE gallery/edit|delete
// cũng chỉ cho admin). Xóa phải qua hộp xác nhận.

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
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  const [slides, setSlides] = useState<any[]>([]);
  const lightbox = useLightBox(slides);
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();
  // Album đang mở menu, và album chờ xác nhận xóa.
  const [selected, setSelected] = useState<any>(null);
  const [toDelete, setToDelete] = useState<any>(null);

  const handleDeleteGallery = useCallback(async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/gallery/delete`, {
        _id: toDelete._id,
      });
      await onRefresh();
      enqueueSnackbar(t('gallery_deleted'));
      setToDelete(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('gallery_delete_failed'), {
        variant: 'error',
      });
    } finally {
      setDeleting(false);
    }
  }, [enqueueSnackbar, onRefresh, toDelete]);

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
          <Card key={image._id} sx={{ cursor: 'pointer', color: 'common.white' }}>
            <IconButton
              aria-label={t('gallery_menu') || ''}
              color={popover.open ? 'inherit' : 'default'}
              onClick={(event) => {
                // Ghi nhận album ngay khi bấm nút (trước đây chỉ khi bấm trúng biểu tượng,
                // bấm lệch vào viền nút thì menu thao tác trên album cũ).
                setSelected(image);
                popover.onOpen(event);
              }}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 9 }}
            >
              <Iconify icon="eva:more-vertical-fill" />
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
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            if (selected) {
              window.open(paths.dashboard.gallery.profile(selected._id), '_blank');
            }
            popover.onClose();
          }}
        >
          <Iconify icon="lsicon:view-filled" />
          {t('gallery_view_detail')}
        </MenuItem>

        {isAdmin && (
          <MenuItem
            onClick={() => {
              if (selected) {
                window.open(paths.dashboard.gallery.edit(selected._id));
              }
              popover.onClose();
            }}
          >
            <Iconify icon="fa7-solid:edit" />
            {t('edit')}
          </MenuItem>
        )}

        {isAdmin && (
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              setToDelete(selected);
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:delete" />
            {t('delete')}
          </MenuItem>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => !deleting && setToDelete(null)}
        title={t('gallery_delete_title')}
        content={t('gallery_delete_confirm', { title: toDelete?.title || '' })}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleting}
            onClick={handleDeleteGallery}
          >
            {t('delete')}
          </LoadingButton>
        }
      />

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
